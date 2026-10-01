const API_BASE_URL = 'http://localhost:3001/api/f1'

const getDrivers = async () => {
  const response = await fetch(`${API_BASE_URL}/drivers`)

  if (!response.ok) {
    throw new Error('Unable to load drivers')
  }

  return await response.json()
}

const getRaces = async (year) => {
  const response = await fetch(`${API_BASE_URL}/races?year=${year}`)

  if (!response.ok) {
    throw new Error('Unable to load races')
  }

  return await response.json()
}

const getRaceFinalResults = async (sessionKey) => {
  const response = await fetch(`${API_BASE_URL}/races/${sessionKey}/finalresults`)

  if (!response.ok) {
    throw new Error('Unable to load race results')
  }

  return await response.json()
}

const getRaceResults = async (sessionKey) => {
  const response = await fetch(`${API_BASE_URL}/races/${sessionKey}/results`)

  if (!response.ok) {
    throw new Error('Unable to load race results')
  }

  return await response.json()
}

const API = {
  getDrivers,
  getRaces,
  getRaceFinalResults,
  getRaceResults
};

export default API;
