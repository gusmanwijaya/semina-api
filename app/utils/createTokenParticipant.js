const createTokenParticipant = (participant) => {
  return {
    _id: participant._id,
    firstName: participant.firstName,
    lastName: participant.lastName,
    email: participant.email,
    role: participant.role,
  };
};

module.exports = createTokenParticipant;
