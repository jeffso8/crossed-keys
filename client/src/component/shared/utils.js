export const organizeUsers = users => {
  const redTeam = [];
  const blueTeam = [];
  const nullTeam = [];

  users.forEach((user) => {
      if(user.team === "RED") {
        redTeam.push(user);
      } else if (user.team === "BLUE") {
        blueTeam.push(user);
      } else {
        nullTeam.push(user);
      }
  });
  // setRedTeam(emptyRedTeam);
  // setBlueTeam(emptyBlueTeam);
  // setNullTeam(emptyNullTeam);
  return {
    redTeam,
    blueTeam,
    nullTeam,
  };
};