const getTargetEmail = ( users, userloggedIn ) => users?.filter((userToFilter) => userToFilter !== userloggedIn.email)[0];

export default getTargetEmail;