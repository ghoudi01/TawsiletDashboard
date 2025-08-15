const CommandStatus = {
    PENDING: 'Pending',
    DISPATCHED_TO_PARTNER: 'Dispatched_to_partner',
    ASSIGNED_TO_DRIVER: 'Assigned_to_driver',
    DRIVER_ON_ROUTE_TO_PICKUP: 'Driver_on_route_to_pickup',
    ARRIVED_AT_PICKUP: 'Arrived_at_pickup',
    PICKED_UP: 'Picked_up',
    ON_ROUTE_TO_DELIVERY: 'On_route_to_delivery',
    ARRIVED_AT_DELIVERY: 'Arrived_at_delivery',
    DELIVERED: 'Delivered',
    COMPLETED: 'Completed',
    CANCELED_BY_CLIENT: 'Canceled_by_client',
    CANCELED_BY_PARTNER: 'Canceled_by_partner',
    CANCELED_BY_ADMIN: 'Canceled_by_admin',
    FAILED_PICKUP: 'Failed_pickup',
    FAILED_DELIVERY: 'Failed_delivery',
  };
  
  
  export default CommandStatus;
  