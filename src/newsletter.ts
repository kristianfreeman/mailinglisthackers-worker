const newsletter = async request => {
  const lp = await fetch('https://mailinglisthackers.ck.page/4cad7bf76b')
  return lp
}

export default newsletter
