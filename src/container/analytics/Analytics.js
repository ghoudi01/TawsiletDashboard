import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Row, Col, Card, Statistic, Table, Tag, Select, Spin, Switch, Tooltip } from "antd";
import styled from "styled-components";
import { GoogleMap, Marker, HeatmapLayer } from "@react-google-maps/api";
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

// date range removed per request

const DEFAULT_CENTER = { lat: 34.8566, lng: 9.3522 };

const Analytics = () => {
  const [requests, setRequests] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  // date range removed per request
  const [showDrivers, setShowDrivers] = useState(true);
  const [showRequests, setShowRequests] = useState(true);
  const [showUsers, setShowUsers] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);

  // committed filters used for data rendering
  const [statusFilter, setStatusFilter] = useState(["searching"]);
  const [vehicleFilter, setVehicleFilter] = useState([]);
  // company filter removed per request

  // pending filters used for debounced UI
  const [statusPending, setStatusPending] = useState(statusFilter);
  const [vehiclePending, setVehiclePending] = useState(vehicleFilter);
  // company filter removed per request

  const [driverCompletions, setDriverCompletions] = useState({});
  const [driverDetails, setDriverDetails] = useState({}); // map of id or documentId -> user
  const [requestDriversCache, setRequestDriversCache] = useState({});

  // load persisted preferences
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("analyticsPrefs") || "{}");
      if (saved) {
        if (Array.isArray(saved.statusFilter)) {
          setStatusFilter(saved.statusFilter);
          setStatusPending(saved.statusFilter);
        }
        if (Array.isArray(saved.vehicleFilter)) {
          setVehicleFilter(saved.vehicleFilter);
          setVehiclePending(saved.vehicleFilter);
        }
        if (Array.isArray(saved.companyFilter)) {
          setCompanyFilter(saved.companyFilter);
          setCompanyPending(saved.companyFilter);
        }
        if (typeof saved.showDrivers === "boolean") setShowDrivers(saved.showDrivers);
        if (typeof saved.showUsers === "boolean") setShowUsers(saved.showUsers);
        if (typeof saved.showRequests === "boolean") setShowRequests(saved.showRequests);
        if (typeof saved.showHeatmap === "boolean") setShowHeatmap(saved.showHeatmap);
      }
    } catch {}
  }, []);

  // persist preferences (committed)
  useEffect(() => {
    const prefs = {
      statusFilter,
      vehicleFilter,
      showDrivers,
      showUsers,
      showRequests,
      showHeatmap,
    };
    try { localStorage.setItem("analyticsPrefs", JSON.stringify(prefs)); } catch {}
  }, [statusFilter, vehicleFilter, showDrivers, showUsers, showRequests, showHeatmap]);

  // sync pending when committed changes externally (e.g., loaded)
  useEffect(() => setStatusPending(statusFilter), [statusFilter]);
  useEffect(() => setVehiclePending(vehicleFilter), [vehicleFilter]);
  // company filter removed per request

  // debounce pending -> committed
  useEffect(() => {
    const t = setTimeout(() => setStatusFilter(statusPending), 300);
    return () => clearTimeout(t);
  }, [statusPending]);
  useEffect(() => {
    const t = setTimeout(() => setVehicleFilter(vehiclePending), 300);
    return () => clearTimeout(t);
  }, [vehiclePending]);
  // company filter removed per request

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

  const filteredRequests = requests;

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

  const availableStatuses = useMemo(() => {
    const s = new Set();
    requests.forEach((r) => s.add(String(r?.status || r?.commandStatus || "unknown")));
    return Array.from(s);
  }, [requests]);

  const availableVehicles = useMemo(() => {
    const s = new Set();
    requests.forEach((r) => {
      const v = r?.vehicleType?.label || r?.vehicleType?.key || r?.vehicleType?.id;
      if (v !== undefined && v !== null) s.add(String(v));
    });
    return Array.from(s);
  }, [requests]);

  // company list removed per request

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
      render: (s, record) => {
        const st = String(s || record.commandStatus || "unknown");
        const { bg, fg } = statusTheme(st);
        const label = st.replace(/_/g, " ");
        return <Tag style={{ backgroundColor: bg, color: fg, borderColor: bg }}>{label}</Tag>;
      },
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
    const statusLower = statusFilter.map((s) => String(s).toLowerCase());
    return filteredRequests
      .filter((r) => {
        const st = String(r?.status || r?.commandStatus || "").toLowerCase();
        const statusMatch = !statusFilter.length || statusLower.includes(st);
        const veh = r?.vehicleType?.label || r?.vehicleType?.key || r?.vehicleType?.id;
        const vehicleMatch = !vehicleFilter.length || vehicleFilter.map(String).includes(String(veh));
        return statusMatch && vehicleMatch;
      })
      .map((r) => {
        const lat = r?.pickupAddress?.latitude || r?.pickupAddress?.lat;
        const lng = r?.pickupAddress?.longitude || r?.pickupAddress?.lng;
        if (!lat || !lng) return null;
        return { id: r.id, lat: Number(lat), lng: Number(lng), status: r.status };
      })
      .filter(Boolean);
  }, [filteredRequests, statusFilter, vehicleFilter]);

  const getDriverCompanyName = useCallback((id) => {
    const d = driverDetails?.[id] || driverDetails?.[String(id)];
    return (d?.company_id?.name || d?.companies?.[0]?.name || "");
  }, [driverDetails]);

  const mapDrivers = useMemo(() => {
    return drivers
      .filter((d) => d?.isActive)
      .map((d) => {
        if (!d?.latitude || !d?.longitude) return null;
        const comp = getDriverCompanyName(d.id);
        if (companyFilter.length && !companyFilter.includes(comp || "")) return null;
        return { id: d.id, lat: Number(d.latitude), lng: Number(d.longitude), isFree: d.isFree, isActive: d.isActive, heading: d.heading || d.angle || 0, company: comp };
      })
      .filter(Boolean);
  }, [drivers, companyFilter, getDriverCompanyName]);

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

  const heatmapData = useMemo(() => {
    if (!showHeatmap || !window.google?.maps) return [];
    try {
      return mapRequests.map((m) => new window.google.maps.LatLng(m.lat, m.lng));
    } catch {
      return [];
    }
  }, [showHeatmap, mapRequests]);

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

            </Row>
          </Cards>
        </Col>

        <Col xs={24} md={8}>
          <Card className="kpi-card" bordered={false}>
            <Statistic title="Requêtes" value={requests.length} />
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
              <Select
                mode="multiple"
                allowClear
                style={{ minWidth: 200 }}
                placeholder="Filtre statut"
                value={statusPending}
                onChange={setStatusPending}
                options={availableStatuses.map((s) => ({ label: s, value: s }))}
              />
              <Select
                mode="multiple"
                allowClear
                style={{ minWidth: 200 }}
                placeholder="Filtre véhicule"
                value={vehiclePending}
                onChange={setVehiclePending}
                options={availableVehicles.map((s) => ({ label: s, value: s }))}
              />
              <Select
                mode="multiple"
                allowClear
                style={{ minWidth: 220 }}
                placeholder="Filtre société"
                value={companyPending}
                onChange={setCompanyPending}
                options={availableCompanies.map((s) => ({ label: s, value: s }))}
              />
              <Tooltip title="Activer la heatmap des requêtes">
                <span>
                  Heatmap <Switch checked={showHeatmap} onChange={setShowHeatmap} />
                </span>
              </Tooltip>
            </div>
            {/* Mini insights */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 8 }}>
              {/* Status totals */}
              <div>
                <strong>Statuts:</strong>
                {availableStatuses.map((s) => {
                  const cnt = filteredRequests.filter((r) => {
                    const st = String(r?.status || r?.commandStatus || "").toLowerCase();
                    const veh = r?.vehicleType?.label || r?.vehicleType?.key || r?.vehicleType?.id;
                    const vehicleMatch = !vehicleFilter.length || vehicleFilter.map(String).includes(String(veh));
                    return st === String(s).toLowerCase() && vehicleMatch;
                  }).length;
                  const selected = statusFilter.map(String).includes(String(s));
                  return (
                    <Tag key={`st-${s}`} color={selected ? "blue" : undefined} style={{ marginLeft: 6 }}>
                      {s}: {cnt}
                    </Tag>
                  );
                })}
              </div>
              {/* Vehicle totals */}
              <div>
                <strong>Véhicules:</strong>
                {availableVehicles.map((v) => {
                  const cnt = filteredRequests.filter((r) => {
                    const st = String(r?.status || r?.commandStatus || "").toLowerCase();
                    const statusMatch = !statusFilter.length || statusFilter.map((x) => String(x).toLowerCase()).includes(st);
                    const veh = r?.vehicleType?.label || r?.vehicleType?.key || r?.vehicleType?.id;
                    return statusMatch && String(veh) === String(v);
                  }).length;
                  const selected = vehicleFilter.map(String).includes(String(v));
                  return (
                    <Tag key={`vh-${v}`} color={selected ? "blue" : undefined} style={{ marginLeft: 6 }}>
                      {v}: {cnt}
                    </Tag>
                  );
                })}
              </div>

            </div>

            <div className="map-wrap">
              <GoogleMap
                center={DEFAULT_CENTER}
                zoom={7}
                mapContainerStyle={{ width: "100%", height: "100%" }}
                onLoad={onLoad}
                onUnmount={onUnmount}
              >
                {showRequests && !showHeatmap && (
                  <MarkerClusterer>
                    {(clusterer) => (
                      <>
                        {mapRequests.map((m) => (
                          <Marker
                            key={`rq-${m.id}`}
                            position={{ lat: m.lat, lng: m.lng }}
                            clusterer={clusterer}
                            zIndex={100}
                            icon={{
                              path: window.google?.maps?.SymbolPath?.CIRCLE,
                              fillColor: "#f97316",
                              scale: 8,
                              fillOpacity: 1,
                              strokeWeight: 2,
                              strokeColor: "#1f2937",
                            }}
                          />
                        ))}
                      </>
                    )}
                  </MarkerClusterer>
                )}
                {showRequests && showHeatmap && heatmapData.length > 0 && (
                  <HeatmapLayer data={heatmapData} options={{ radius: 30, dissipating: true }} />
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
                            zIndex={200}
                            title={`${getDriverName(m.id)}`}
                            icon={{
                              path: window.google?.maps?.SymbolPath?.FORWARD_CLOSED_ARROW,
                              fillColor: m.isFree ? "#16a34a" : "#ef4444",
                              scale: 6,
                              fillOpacity: 1,
                              strokeWeight: 2,
                              strokeColor: "#111827",
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
                            zIndex={150}
                            title={`Utilisateur ${u.id}`}
                            icon={{
                              path: window.google?.maps?.SymbolPath?.CIRCLE,
                              fillColor: "#2563eb",
                              scale: 6,
                              fillOpacity: 1,
                              strokeWeight: 2,
                              strokeColor: "#111827",
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

function statusTheme(s) {
  const key = String(s || "").toLowerCase();
  const themes = {
    searching: { bg: "#f97316", fg: "#ffffff" },
    pending: { bg: "#f59e0b", fg: "#ffffff" },
    assigned_to_driver: { bg: "#3b82f6", fg: "#ffffff" },
    completed: { bg: "#16a34a", fg: "#ffffff" },
    canceled_by_client: { bg: "#ef4444", fg: "#ffffff" },
    canceled_by_partner: { bg: "#ef4444", fg: "#ffffff" },
    delivered: { bg: "#22c55e", fg: "#ffffff" },
  };
  return themes[key] || { bg: "#6b7280", fg: "#ffffff" };
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
