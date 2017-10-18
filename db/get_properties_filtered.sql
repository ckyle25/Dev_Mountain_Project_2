SELECT * FROM Properties
WHERE desired_rent > ${desired_rent} AND userid = ${userID}
ORDER BY desired_rent
