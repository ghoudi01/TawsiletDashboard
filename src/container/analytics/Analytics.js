import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Row, Col, Card, Statistic, Table, Tag, Select, Spin, Switch, Tooltip } from "antd";
import styled from "styled-components";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { MarkerClusterer } from "@react-google-maps/api";
import { ref, onValue } from "firebase/database";
import { database } from "../../config/firebase";
import {
  ChartjsLineChart,
  ChartjsPieChart,
  ChartjsDonut,
} from "../../components/charts/chartjs";
import { Cards } from "../../components/cards/frame/cards-frame";
import reqSample from "../../requestExample.json";
import userSample from "../../userExample.json";
import driverSample from "../../driverExample.json";
import dayjs from "dayjs";
import axios from "axios";

const Container = styled.div`
  .kpi-card .ant-statistic-title {
    color: #868eae;
  }
  .map-wrap {
    height: 420px;
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
  }
`;

const dateRanges = [
  { label: "24h", value: "24h" },
  { label: "7j", value: "7d" },
  { label: "30j", value: "30d" },
  { label: "Tout", value: "all" },
];

const DEFAULT_CENTER = { lat: 34.8566, lng: 9.3522 };

const Analytics = () => {
  const [requests, setRequests] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("7d");
  const [showDrivers, setShowDrivers] = useState(true);
  const [showRequests, setShowRequests] = useState(true);
  const [showUsers, setShowUsers] = useState(true);
  const [driverCompletions, setDriverCompletions] = useState({});
  const [driverDetails, setDriverDetails] = useState({}); // map of id or documentId -> user
  const [requestDriversCache, setRequestDriversCache] = useState({});

  useEffect(() => {
    const unsubscribers = [];
    setLoading(true);

    const rqRef = ref(database, "rideRequests");
    unsubscribers.push(
      onValue(rqRef, (snap) => {
        const val = snap.val();
        if (val) {
          const arr = Object.entries(val).map(([id, v]) => ({ id, ...v }));
          setRequests(arr);
        } else {
          setRequests([
            { id: "sample", ...reqSample },
          ]);
        }
      })
    );

    const drRef = ref(database, "drivers");
    unsubscribers.push(
      onValue(drRef, (snap) => {
        const val = snap.val();
        if (val) {
          const arr = Object.entries(val).map(([id, v]) => ({ id, ...v }));
          setDrivers(arr);
        } else {
          setDrivers([{ id: driverSample.id || "sample-driver", ...driverSample }]);
        }
      })
    );

    const usRef = ref(database, "users");
    unsubscribers.push(
      onValue(usRef, (snap) => {
        const val = snap.val();
        if (val) {
          const arr = Object.entries(val).map(([id, v]) => ({ id, ...v }));
          setUsers(arr);
        } else {
          setUsers([{ id: "sample-user", ...userSample }]);
        }
      })
    );

    setLoading(false);
    return () => unsubscribers.forEach((u) => (typeof u === "function" ? u() : null));
  }, []);

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) return;
    const run = async () => {
      try {
        const url = new URL(`${process.env.REACT_APP_BACKUP_URL}commands`);
        url.searchParams.append("pagination[page]", "1");
        url.searchParams.append("pagination[pageSize]", "2000");
        url.searchParams.append("filters[commandStatus][$eq]", "Completed");
        url.searchParams.append("populate[0]", "driver_id");
        const { data } = await axios.get(url.toString(), {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        const list = data?.data || [];
        const counts = {};
        const details = {};
        list.forEach((cmd) => {
          const d = cmd?.driver_id;
          const docId = d?.documentId || d?.data?.documentId;
          const numericId = d?.id;
          if (docId) counts[docId] = (counts[docId] || 0) + 1;
          if (d) {
            if (docId) details[docId] = d;
            if (numericId) details[String(numericId)] = d;
          }
        });
        setDriverCompletions(counts);
        setDriverDetails((prev) => ({ ...prev, ...details }));
      } catch (e) {
        // silent
      }
    };
    run();
  }, []);

  const now = Date.now();
  const rangeMs = useMemo(() => {
    switch (range) {
      case "24h":
        return 24 * 60 * 60 * 1000;
      case "7d":
        return 7 * 24 * 60 * 60 * 1000;
      case "30d":
        return 30 * 24 * 60 * 60 * 1000;
      default:
        return Infinity;
    }
  }, [range]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const createdAt = Number(r.createdAt || 0);
      if (!createdAt || range === "all") return true;
      return now - createdAt <= rangeMs;
    });
  }, [requests, now, range, rangeMs]);

  // fetch driver details for drivers present in Firebase by documentId (chunked)
  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt || !drivers?.length) return;
    const ids = Array.from(new Set(drivers.map((d) => d.id).filter(Boolean)));
    const chunkArray = (array, size) => {
      const res = [];
      for (let i = 0; i < array.length; i += size) res.push(array.slice(i, i + size));
      return res;
    };
    const run = async () => {
      try {
        const chunks = chunkArray(ids, 100);
        const merged = {};
        for (const chunk of chunks) {
          const params = new URLSearchParams();
          chunk.forEach((id, idx) => params.append(`filters[documentId][$in][${idx}]`, id));
          const url = `${process.env.REACT_APP_BACKUP_URL}users?${params.toString()}`;
          const { data } = await axios.get(url, { headers: { Authorization: `Bearer ${jwt}` } });
          data.forEach((u) => {
            if (u?.documentId) merged[u.documentId] = u;
            if (u?.id) merged[String(u.id)] = u;
          });
        }
        if (Object.keys(merged).length) setDriverDetails((prev) => ({ ...prev, ...merged }));
      } catch (e) {
        // silent
      }
    };
    run();
  }, [drivers]);

  const requestStatusCounts = useMemo(() => {
    const map = {};
    filteredRequests.forEach((r) => {
      const s = r.status || r.commandStatus || "unknown";
      map[s] = (map[s] || 0) + 1;
    });
    const labels = Object.keys(map);
    const data = labels.map((k) => map[k]);
    return { labels, data };
  }, [filteredRequests]);

  const requestsByDay = useMemo(() => {
    const buckets = {};
    filteredRequests.forEach((r) => {
      const ts = Number(r.createdAt || 0);
      const day = ts ? dayjs(ts).format("YYYY-MM-DD") : "N/A";
      buckets[day] = (buckets[day] || 0) + 1;
    });
    const labels = Object.keys(buckets).sort();
    const data = labels.map((d) => buckets[d]);
    return { labels, data };
  }, [filteredRequests]);

  const avgRequestResponseMinutes = useMemo(() => {
    const times = filteredRequests
      .map((r) => parseResponseMinutes(r?.time))
      .filter((v) => typeof v === "number" && !Number.isNaN(v));
    if (!times.length) return null;
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  }, [filteredRequests]);

  const driverKpis = useMemo(() => {
    const total = drivers.length;
    const active = drivers.filter((d) => d.isActive).length;
    const free = drivers.filter((d) => d.isFree).length;
    return { total, active, free };
  }, [drivers]);

  const userKpis = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.isActive || u.is_active).length;
    return { total, active };
  }, [users]);

  const recentRequests = useMemo(() => {
    const copy = [...filteredRequests];
    copy.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
    return copy.slice(0, 50);
  }, [filteredRequests]);

  const requestColumns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => (v ? dayjs(Number(v)).format("YYYY-MM-DD HH:mm") : "-"),
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      render: (s, record) => (
        <Tag color={statusColor(s || record.commandStatus || "unknown")}>
          {s || record.commandStatus || "unknown"}
        </Tag>
      ),
    },
    {
      title: "Pickup",
      dataIndex: ["pickupAddress", "address"],
      key: "pickup",
      ellipsis: true,
      render: (_, r) => r?.pickupAddress?.address || "-",
    },
    {
      title: "Drop",
      dataIndex: ["dropAddress", "address"],
      key: "drop",
      ellipsis: true,
      render: (_, r) => r?.dropAddress?.address || r?.dropoffAddress?.address || "-",
    },
    {
      title: "Temps de réponse",
      dataIndex: "time",
      key: "time",
      render: (t) => t || "N/A",
    },
    {
      title: "Prix",
      dataIndex: "price",
      key: "price",
      render: (p) => (p ? `${p} DT` : "-"),
    },
  ];

  const driverColumns = [
    { title: "Nom", key: "name", render: (_, r) => getDriverName(r.id) },
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Actif",
      dataIndex: "isActive",
      key: "isActive",
      render: (v) => <Tag color={v ? "green" : "red"}>{v ? "Oui" : "Non"}</Tag>,
    },
    {
      title: "Libre",
      dataIndex: "isFree",
      key: "isFree",
      render: (v) => <Tag color={v ? "blue" : "orange"}>{v ? "Oui" : "Occupé"}</Tag>,
    },
    {
      title: "Complétées",
      dataIndex: "completed",
      key: "completed",
      render: (_, r) => driverCompletions?.[r.id] || 0,
    },
    {
      title: "Last seen",
      dataIndex: "lastSeen",
      key: "lastSeen",
      render: (v) => (v ? fromNow(v) : "-"),
    },
  ];

  const userColumns = [
    { title: "User", dataIndex: "id", key: "id" },
    {
      title: "Actif",
      dataIndex: "isActive",
      key: "isActive",
      render: (v, r) => (
        <Tag color={v || r.is_active ? "green" : "red"}>{v || r.is_active ? "Oui" : "Non"}</Tag>
      ),
    },
    { title: "Latitude", dataIndex: "latitude", key: "lat" },
    { title: "Longitude", dataIndex: "longitude", key: "lng" },
  ];

  const mapRequests = useMemo(() => {
    return filteredRequests
      .filter((r) => String(r?.status || "").toLowerCase() === "searching")
      .map((r) => {
        const lat = r?.pickupAddress?.latitude || r?.pickupAddress?.lat;
        const lng = r?.pickupAddress?.longitude || r?.pickupAddress?.lng;
        if (!lat || !lng) return null;
        return { id: r.id, lat: Number(lat), lng: Number(lng), status: r.status };
      })
      .filter(Boolean);
  }, [filteredRequests]);

  const mapDrivers = useMemo(() => {
    return drivers
      .filter((d) => d?.isActive)
      .map((d) => {
        if (!d?.latitude || !d?.longitude) return null;
        return { id: d.id, lat: Number(d.latitude), lng: Number(d.longitude), isFree: d.isFree, isActive: d.isActive, heading: d.heading || d.angle || 0 };
      })
      .filter(Boolean);
  }, [drivers]);

  const mapUsers = useMemo(() => {
    return users
      .filter((u) => u && (u.isActive || u.is_active))
      .map((u) => {
        const lat = u.latitude || u?.location?.latitude;
        const lng = u.longitude || u?.location?.longitude;
        if (!lat || !lng) return null;
        return { id: u.id, lat: Number(lat), lng: Number(lng) };
      })
      .filter(Boolean);
  }, [users]);

  const [map, setMap] = useState(null);
  const onLoad = useCallback((m) => setMap(m), []);
  const onUnmount = useCallback(() => setMap(null), []);

  const getDriverName = useCallback((id) => {
    const d = driverDetails?.[id] || driverDetails?.[String(id)];
    if (!d) return id;
    const name = [d.firstName, d.lastName].filter(Boolean).join(" ") || d.username || d.email;
    return name || id;
  }, [driverDetails]);

  const fetchDriverDetailsForIds = useCallback(async (ids) => {
    try {
      const jwt = localStorage.getItem("token");
      if (!jwt || !ids?.length) return;
      const numeric = ids.filter((id) => /^\d+$/.test(String(id)));
      const docs = ids.filter((id) => !/^\d+$/.test(String(id)));
      const merged = {};
      if (docs.length) {
        const params = new URLSearchParams();
        docs.forEach((id, idx) => params.append(`filters[documentId][$in][${idx}]`, id));
        const { data } = await axios.get(`${process.env.REACT_APP_BACKUP_URL}users?${params.toString()}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        data.forEach((u) => { if (u?.documentId) merged[u.documentId] = u; });
      }
      if (numeric.length) {
        const params = new URLSearchParams();
        numeric.forEach((id, idx) => params.append(`filters[id][$in][${idx}]`, String(id)));
        const { data } = await axios.get(`${process.env.REACT_APP_BACKUP_URL}users?${params.toString()}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        data.forEach((u) => { if (u?.id) merged[String(u.id)] = u; });
      }
      if (Object.keys(merged).length) setDriverDetails((prev) => ({ ...prev, ...merged }));
    } catch(e) {}
  }, [setDriverDetails]);

  const buildRequestDriverRows = useCallback((record) => {
    const notified = record?.notifiedDrivers || {};
    const silenced = record?.silencedDrivers || {};
    const accepted = [];
    const rejected = [];
    const silencedOnly = [];

    Object.entries(notified).forEach(([id, val]) => {
      if (val) accepted.push(id); else rejected.push(id);
    });
    const notifiedSet = new Set(Object.keys(notified));
    Object.keys(silenced).forEach((id) => { if (!notifiedSet.has(id)) silencedOnly.push(id); });

    const rows = [
      ...accepted.map((id) => ({ id, status: "Accepté" })),
      ...rejected.map((id) => ({ id, status: "Rejeté" })),
      ...silencedOnly.map((id) => ({ id, status: "Aucune action" })),
    ];
    return rows;
  }, []);

  const expandedDriversView = useCallback((record) => {
    const rows = buildRequestDriverRows(record);
    const columns = [
      { title: "Chauffeur", key: "name", render: (_, r) => getDriverName(r.id) },
      { title: "ID", dataIndex: "id", key: "id" },
      { title: "Statut", dataIndex: "status", key: "status", render: (s) => (
        <Tag color={s === "Accepté" ? "green" : s === "Rejeté" ? "red" : "orange"}>{s}</Tag>
      ) },
    ];
    return (
      <div style={{ padding: 12 }}>
        <Table size="small" rowKey={(r) => `${record.id}-${r.id}`} dataSource={rows} columns={columns} pagination={false} />
      </div>
    );
  }, [buildRequestDriverRows, getDriverName]);

  const onExpandRequest = useCallback((expanded, record) => {
    if (!expanded) return;
    const rows = buildRequestDriverRows(record);
    const ids = rows.map((r) => r.id);
    const missing = ids.filter((id) => !driverDetails?.[id] && !driverDetails?.[String(id)]);
    if (missing.length) fetchDriverDetailsForIds(missing);
  }, [buildRequestDriverRows, driverDetails, fetchDriverDetailsForIds]);

  if (loading) {
    return (
      <div className="app_with_overlay_spinner">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={24}>
          <Cards headless>
            <Row justify="space-between" align="middle">
              <Col>
                <h2>Analytics</h2>
                <span>Résumé des requêtes, chauffeurs et utilisateurs</span>
              </Col>
              <Col>
                <Select
                  value={range}
                  onChange={setRange}
                  options={dateRanges}
                  style={{ width: 120 }}
                />
              </Col>
            </Row>
          </Cards>
        </Col>

        <Col xs={24} md={8}>
          <Card className="kpi-card" bordered={false}>
            <Statistic title="Requêtes" value={filteredRequests.length} />
            <div style={{ height: 8 }} />
            <small>Total filtré par période</small>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="kpi-card" bordered={false}>
            <Statistic title="Chauffeurs actifs" value={driverKpis.active} suffix={`/ ${driverKpis.total}`} />
            <div style={{ height: 8 }} />
            <small>Chauffeurs libres: {driverKpis.free}</small>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="kpi-card" bordered={false}>
            <Statistic title="Utilisateurs actifs" value={userKpis.active} suffix={`/ ${userKpis.total}`} />
            <div style={{ height: 8 }} />
            <small>Moy. réponse: {avgRequestResponseMinutes !== null ? `${avgRequestResponseMinutes} min` : "N/A"}</small>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Cards title="Requêtes par jour">
            <ChartjsLineChart
              height={260}
              labels={requestsByDay.labels}
              datasets={[
                {
                  label: "Requêtes",
                  data: requestsByDay.data,
                  borderColor: "#5F63F2",
                  borderWidth: 2,
                  fill: false,
                },
              ]}
              options={{
                legend: { display: false },
                scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
              }}
            />
          </Cards>
        </Col>
        <Col xs={24} md={8}>
          <Cards title="Répartition des statuts">
            <ChartjsPieChart
              height={220}
              labels={requestStatusCounts.labels}
              datasets={[
                {
                  data: requestStatusCounts.data,
                  backgroundColor: palette(requestStatusCounts.labels.length),
                },
              ]}
              options={{ legend: { display: true, position: "bottom" } }}
            />
          </Cards>
        </Col>

        <Col xs={24} md={24}>
          <Cards title={
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span>Carte activité</span>
              <Tooltip title="Afficher les chauffeurs">
                <span>
                  Chauffeurs <Switch checked={showDrivers} onChange={setShowDrivers} />
                </span>
              </Tooltip>
              <Tooltip title="Afficher les utilisateurs">
                <span>
                  Utilisateurs <Switch checked={showUsers} onChange={setShowUsers} />
                </span>
              </Tooltip>
              <Tooltip title="Afficher les requêtes (searching)">
                <span>
                  Requêtes <Switch checked={showRequests} onChange={setShowRequests} />
                </span>
              </Tooltip>
            </div>
          }>
            <div className="map-wrap">
              <GoogleMap
                center={DEFAULT_CENTER}
                zoom={7}
                mapContainerStyle={{ width: "100%", height: "100%" }}
                onLoad={onLoad}
                onUnmount={onUnmount}
              >
                {showRequests && (
                  <MarkerClusterer>
                    {(clusterer) => (
                      <>
                        {mapRequests.map((m) => (
                          <Marker
                            key={`rq-${m.id}`}
                            position={{ lat: m.lat, lng: m.lng }}
                            clusterer={clusterer}
                            icon={{
                              path: window.google?.maps?.SymbolPath?.CIRCLE,
                              fillColor: "#fa8b0c",
                              scale: 6,
                              fillOpacity: 1,
                              strokeWeight: 1,
                              strokeColor: "#fff",
                            }}
                          />
                        ))}
                      </>
                    )}
                  </MarkerClusterer>
                )}
                {showDrivers && (
                  <MarkerClusterer>
                    {(clusterer) => (
                      <>
                        {mapDrivers.map((m) => (
                          <Marker
                            key={`dr-${m.id}`}
                            position={{ lat: m.lat, lng: m.lng }}
                            clusterer={clusterer}
                            title={`${getDriverName(m.id)}`}
                            icon={{
                              path: window.google?.maps?.SymbolPath?.FORWARD_CLOSED_ARROW,
                              fillColor: m.isFree ? "#20C997" : "#f5222d",
                              scale: 5,
                              fillOpacity: 1,
                              strokeWeight: 1,
                              strokeColor: "#fff",
                              rotation: m.heading || 0,
                            }}
                          />
                        ))}
                      </>
                    )}
                  </MarkerClusterer>
                )}
                {showUsers && (
                  <MarkerClusterer>
                    {(clusterer) => (
                      <>
                        {mapUsers.map((u) => (
                          <Marker
                            key={`u-${u.id}`}
                            position={{ lat: u.lat, lng: u.lng }}
                            clusterer={clusterer}
                            title={`Utilisateur ${u.id}`}
                            icon={{
                              path: window.google?.maps?.SymbolPath?.CIRCLE,
                              fillColor: "#2D99FF",
                              scale: 5,
                              fillOpacity: 1,
                              strokeWeight: 1,
                              strokeColor: "#fff",
                            }}
                          />
                        ))}
                      </>
                    )}
                  </MarkerClusterer>
                )}
              </GoogleMap>
            </div>
          </Cards>
        </Col>

        <Col xs={24} md={14}>
          <Cards title="Requêtes récentes">
            <Table
              rowKey={(r) => r.id}
              dataSource={recentRequests}
              columns={requestColumns}
              expandable={{ expandedRowRender: (record) => expandedDriversView(record), onExpand: onExpandRequest, rowExpandable: () => true }}
              pagination={{ pageSize: 10 }}
            />
          </Cards>
        </Col>
        <Col xs={24} md={10}>
          <Cards title="État des chauffeurs">
            <ChartjsDonut
              height={220}
              labels={["Actifs", "Inactifs", "Libres", "Occupés"]}
              datasets={[
                {
                  data: [
                    driverKpis.active,
                    Math.max(driverKpis.total - driverKpis.active, 0),
                    driverKpis.free,
                    Math.max(driverKpis.total - driverKpis.free, 0),
                  ],
                  backgroundColor: ["#20C997", "#E5E9F2", "#5F63F2", "#FA8B0C"],
                },
              ]}
              options={{ legend: { display: true, position: "bottom" } }}
            />
          </Cards>
          <Cards title="Chauffeurs">
            <Table
              size="small"
              rowKey={(r) => r.id}
              dataSource={drivers.slice(0, 50)}
              columns={driverColumns}
              pagination={{ pageSize: 8 }}
            />
          </Cards>
        </Col>

        <Col xs={24} md={14}>
          <Cards title="Utilisateurs">
            <Table
              rowKey={(r) => r.id}
              dataSource={users.slice(0, 50)}
              columns={userColumns}
              pagination={{ pageSize: 10 }}
            />
          </Cards>
        </Col>
        <Col xs={24} md={10}>
          <Cards title="Activité utilisateurs">
            <ChartjsDonut
              height={220}
              labels={["Actifs", "Inactifs"]}
              datasets={[
                {
                  data: [userKpis.active, Math.max(userKpis.total - userKpis.active, 0)],
                  backgroundColor: ["#20C997", "#E5E9F2"],
                },
              ]}
              options={{ legend: { display: true, position: "bottom" } }}
            />
          </Cards>
        </Col>
      </Row>
    </Container>
  );
};

function parseResponseMinutes(text) {
  if (!text || typeof text !== "string") return null;
  const t = text.toLowerCase();
  const m = t.match(/(\d+)(\s*)(min|minute|minutes)/);
  if (m) return Number(m[1]);
  const s = t.match(/(\d+)(\s*)(sec|second|seconds)/);
  if (s) return Math.round(Number(s[1]) / 60);
  return null;
}

function fromNow(ts) {
  const diff = Date.now() - Number(ts || 0);
  if (!Number.isFinite(diff)) return "-";
  const m = Math.floor(diff / 60000);
  if (m < 1) return "<1m";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}j`;
}

function statusColor(s) {
  const map = {
    searching: "orange",
    pending: "orange",
    Assigned_to_driver: "blue",
    Completed: "green",
    Canceled_by_client: "red",
    Canceled_by_partner: "red",
    unknown: "default",
  };
  return map[s] || "purple";
}

function palette(n) {
  const base = ["#5F63F2", "#20C997", "#FA8B0C", "#FF69A5", "#2D99FF", "#A461D8", "#66D36E", "#FFC542"];
  if (n <= base.length) return base.slice(0, n);
  const arr = [...base];
  while (arr.length < n) arr.push(randomColor());
  return arr;
}

function randomColor() {
  const r = Math.floor(150 + Math.random() * 105);
  const g = Math.floor(150 + Math.random() * 105);
  const b = Math.floor(150 + Math.random() * 105);
  return `rgb(${r},${g},${b})`;
}

export default Analytics;

export default Analytics;
