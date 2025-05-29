import { Button, Dropdown, Tag } from "antd";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";

export const transformReservations = (
  reservations,
  handleStatus,
  handleStatusText,
  trashView,
  setSelectedId,
  setOpenReserver,
  dispatch,
  updateReservation,
  getReservations,
  setOpen,
  setSelectedData
) => {
  return reservations?.map((value) => ({
    key: value?.documentId,
    id: value?.refNumber,
    pickupAddress: value.pickUpAddress?.Address?.substring(0, 30) + "...",
    deliveryAddress: value.dropOfAddress?.Address?.substring(0, 30) + "...",
    dateCreation: value.createdAt?.slice(0, 10),
    dateDepart: value.departDate,
    deparTime: value.deparTime?.slice(0, 5),

    idClient: (
      <div className="table_cell_flex">
        <p className="no-margin" style={{ color: "blue" }}>
          {value?.client?.firstName} {value?.client?.lastName}
        </p>
      </div>
    ),

    payType: (
      <div className="table_paytype">
        <label style={{ display: "none" }} htmlFor="">
          {value?.payType}
        </label>
        <p className="no-margin">{value?.totalPrice} TND</p>
        {value?.payType?.toLowerCase() === "livraison" ? (
          <img src="../../images/livraison.png" alt="Livraison" />
        ) : (
          <img src="../../images/carte_Banquaire.png" alt="Carte Bancaire" />
        )}
      </div>
    ),

    commandStatus: (
      <Tag
        style={{
          backgroundColor: `${handleStatus(value.commandStatus) + "50"}`,
          color: `${handleStatus(value.commandStatus)}`,
        }}
        className={value.commandStatus}
      >
        {handleStatusText(value.commandStatus)}
      </Tag>
    ),

    action: (
      <>
        {!trashView ? (
          value.paymentStatus === "linkSend" ? (
            <Button className="btn__impayer">Impayé</Button>
          ) : value.commandStatus === "Completed" ? (
            <Button className="btn__livre">Livré</Button>
          ) : value.commandStatus !== "Canceled" ? (
            <Button
              className="btn__reserver"
              onClick={() => {
                setSelectedId(value);
                setOpenReserver(true);
              }}
            >
              Réserver
            </Button>
          ) : null
        ) : (
          <Button
            className="btn__restorer"
            onClick={() =>
              dispatch(
                updateReservation({
                  id: value?.id,
                  body: {
                    data: {
                      isArchived: false,
                    },
                  },
                })
              ).then(() => dispatch(getReservations()))
            }
          >
            Restorer
          </Button>
        )}
      </>
    ),

    more: (
      <>
        {!trashView ? (
          <Dropdown
            className="wide-dropdwon"
            overlay={
              <>
                <Link
                  key={"see"}
                  to="#"
                  onClick={() => {
                    setOpen(true);
                    setSelectedData(value);
                  }}
                >
                  Voir
                </Link>

                <Link
                  key={"delete"}
                  to="#"
                  onClick={() =>
                    dispatch(
                      updateReservation({
                        id: value?.id,
                        body: {
                          data: {
                            isArchived: true,
                          },
                        },
                      })
                    ).then(() => dispatch(getReservations()))
                  }
                >
                  Supprimer
                </Link>
              </>
            }
            trigger={["click"]}
          >
            <Link to="#">
              <span>
                <FeatherIcon icon="more-horizontal" size={18} />
              </span>
            </Link>
          </Dropdown>
        ) : null}
      </>
    ),
  }));
};
