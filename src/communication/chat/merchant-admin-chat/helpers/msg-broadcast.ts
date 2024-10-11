import {
  adminMerchantChat,
  checkOpenConnection,
  merchantAdminChatEvents,
} from '../../utils';

export interface broadcastByRoleUserDetails {
  userType: 'merchant' | 'admin';
  msg: any;
}

export const broadcastRoomMsg = (
  chatRooms: adminMerchantChat['chatRooms'],
  clientSocketMap: adminMerchantChat['clientSocketMap'],
  merchantRegistrationId: number,
  msg: any,
  event: merchantAdminChatEvents,
) => {
  const chatRoom = chatRooms[merchantRegistrationId];
  const newChatRoolList = chatRoom.reduce((list, clientId) => {
    const socketDetails = clientSocketMap[clientId];
    const isSocketOpen = checkOpenConnection(socketDetails.client);
    isSocketOpen && list.push(clientId);
    if (isSocketOpen)
      socketDetails.client.send(
        JSON.stringify({
          data: msg,
          event,
        }),
      );
    if (!isSocketOpen) {
      socketDetails.client.close();
      delete clientSocketMap[clientId];
    }
    return list;
  }, []);
  chatRooms[merchantRegistrationId] = newChatRoolList;
  const isEmptyRoom = !newChatRoolList.length;
  if (isEmptyRoom) {
    delete chatRooms[`${merchantRegistrationId}`];
  }
};

export const broadcastMsgByUserType = (
  chatRooms: adminMerchantChat['chatRooms'],
  clientSocketMap: adminMerchantChat['clientSocketMap'],
  merchantRegistrationId: number,
  details: broadcastByRoleUserDetails[],
  event: merchantAdminChatEvents,
) => {
  const chatRoom = chatRooms[merchantRegistrationId];
  const newChatRoolList = chatRoom.reduce((list, clientId) => {
    const socketDetails = clientSocketMap[clientId];
    const isSocketOpen = checkOpenConnection(socketDetails.client);
    const userRole = socketDetails.isClientMerchant ? 'merchant' : 'admin';
    const msg = details.find(
      (roleDetails) => roleDetails.userType === userRole,
    )?.msg;
    isSocketOpen && list.push(clientId);
    if (isSocketOpen && msg)
      socketDetails.client.send(
        JSON.stringify({
          data: msg,
          event,
        }),
      );
    if (!isSocketOpen) {
      socketDetails.client.close();
      delete clientSocketMap[clientId];
    }
    return list;
  }, []);
  chatRooms[merchantRegistrationId] = newChatRoolList;
  const isEmptyRoom = !newChatRoolList.length;
  if (isEmptyRoom) {
    delete chatRooms[`${merchantRegistrationId}`];
  }
};
