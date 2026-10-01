import { useEffect, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Image from 'react-bootstrap/Image'
import Spinner from 'react-bootstrap/Spinner'
import 'bootstrap/dist/css/bootstrap.min.css'
import API from './API.mjs'

function App() {
  const [drivers, setDrivers] = useState([])
  const [selectedDriver, setSelectedDriver] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const [year, setYear] = useState('2023')

  const [races, setRaces] = useState([])
  const [selectedRace, setSelectedRace] = useState('')
  
  const [raceResults, setRaceResults] = useState([])

  useEffect(() => {
    async function loadDrivers() {
      try {
        const data = await API.getDrivers()
        setDrivers(data)
      } catch (requestError) {
        setError(requestError.message)
      } finally {
        setLoading(false)
      }
    }

    loadDrivers()
  }, [])

  // Carica le gare dell'anno selezionato 
  useEffect(() => { 
    async function loadRaces() { 
      try { 
        setLoading(true) 
        setError('') 
        setSelectedRace('') 
        setRaceResults([]) 
        const data = await API.getRaces(year) 
        setRaces(data) 
      } catch (requestError) { 
        setError(requestError.message) 
        setRaces([]) 
      } finally { 
        setLoading(false) 
      } 
    } 
    
    loadRaces() 
  }, [year])
  
    useEffect(() => { 
    async function loadRaceResult() { 
      if (!selectedRace) { 
        setRaceResults([]) 
        return 
      }
      try { 
        setLoading(true) 
        setError('')
        const data = await API.getRaceResults(selectedRace) 
        setRaceResults(data) 
      } catch (requestError) { 
        setError(requestError.message) 
        setRaceResults([]) 
      } finally { 
        setLoading(false) 
      } 
    } 
    
    loadRaceResult() 
  }, [selectedRace])
  


  const selectedDriverDetails = drivers.find(
    (driver) => String(driver.driver_number) === selectedDriver,
  )

  const selectedRaceDetails = races.find( 
    (race) => String(race.session_key) === selectedRace, 
  )

  const handleRaceChange = (event) => {
    setError('')
    setSelectedRace(event.target.value)
  }

  return (
    // <Container className="py-5">
    //   <Card className="mx-auto" style={{ maxWidth: '560px' }}>
    //     <Card.Body>
    //       <Card.Subtitle className="mb-2 text-body-secondary">
    //         Formula 1 data
    //       </Card.Subtitle>
    //       <Card.Title as="h1">Choose a driver</Card.Title>
    //       <Card.Text>Browse the drivers returned by OpenF1.</Card.Text>

    //       <Form.Group controlId="driver-select">
    //         <Form.Label>Driver</Form.Label>
    //         <Form.Select
    //           value={selectedDriver}
    //           onChange={(event) => setSelectedDriver(event.target.value)}
    //           disabled={loading || Boolean(error)}
    //         >
    //           <option value="">
    //             {loading ? 'Loading drivers...' : 'Select a driver'}
    //           </option>
    //           {drivers.map((driver) => (
    //             <option key={driver.driver_number} value={driver.driver_number}>
    //               {driver.full_name} (#{driver.driver_number})
    //             </option>
    //           ))}
    //         </Form.Select>
    //       </Form.Group>

    //       {loading && (
    //         <div className="mt-3">
    //           <Spinner animation="border" size="sm" role="status" />
    //           <span className="ms-2">Loading drivers...</span>
    //         </div>
    //       )}
    //       {error && <Alert className="mt-3 mb-0" variant="danger">{error}</Alert>}
    //       {selectedDriverDetails && (
    //         <Alert className="mt-3 mb-0 d-flex align-items-center gap-3" variant="success">
    //           {selectedDriverDetails.headshot_url && (
    //             <Image
    //               src={selectedDriverDetails.headshot_url}
    //               alt={`Headshot of ${selectedDriverDetails.full_name}`}
    //               width={64}
    //               height={64}
    //               roundedCircle
    //             />
    //           )}
    //           <span>
    //             Selected: <strong>{selectedDriverDetails.full_name}</strong> #{selectedDriverDetails.driver_number}
    //           </span>
    //         </Alert>
    //       )}
    //     </Card.Body>
    //   </Card>
    // </Container>


    <Container className="py-5">
      <Card className="mx-auto" style={{ maxWidth: '560px' }}>
        <Card.Body>
          <Card.Subtitle className="mb-2 text-body-secondary">
            Formula 1 data 🏎️
          </Card.Subtitle>
          <Card.Title as="h1">Choose a race 🏁</Card.Title>
          <Card.Text> Select a year and then choose a race. </Card.Text>

          {/* YEAR */}
          <Form.Group controlId="year-select">
            <Form.Label>Year</Form.Label>
            <Form.Select
              value={year}
              onChange={(event) => setYear(event.target.value)}
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>              
            </Form.Select>
          </Form.Group>

          {/* RACE */}
          <Form.Group controlId="race-select">
            <Form.Label>Race</Form.Label>

            <Form.Select
              value={selectedRace}
              onChange={handleRaceChange}
              disabled={loading}
            >
              <option value="">
                {loading ? 'Loading races...' : 'Select a race'}
              </option>

              {races.map((race) => (
                <option key={race.session_key} value={race.session_key}>
                  {race.country_name} - {race.location}
                  {race.session_name === 'Sprint' ? ' - Sprint 💨' : ''} ({new Date(race.date_start).toLocaleDateString()})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {loading && (
            <div className="mt-3">
              <Spinner animation="border" size="sm" role="status" />
              <span className="ms-2">Loading races...</span>
            </div>
          )}
          {error && <Alert className="mt-3 mb-0" variant="danger">{error}</Alert>}
          {selectedRaceDetails && (
            <Alert className="mt-3 mb-0 d-flex align-items-center gap-3" variant="success">
              <span>
                Selected: <strong>{selectedRaceDetails.country_name}</strong> - {selectedRaceDetails.location}
                {selectedRaceDetails.session_name === 'Sprint' ? ' - Sprint' : ''}
                <small> {new Date( selectedRaceDetails.date_start ).toLocaleDateString()} </small>
              </span>
            </Alert>
          )}
          {raceResults.length > 0 && (
            <div className="mt-4">
              <h2 className="h5">Race Results</h2>

              <table className="table table-striped">
                <thead>
                  <tr>
                    <th> Position</th>
                    <th> Driver Number</th>
                    <th> Driver Name</th>
                  </tr>
                </thead>
                
                <tbody>
                  {raceResults.map((result) => {
                    const driver = drivers.find(
                      (d) => d.driver_number === result.driver_number
                    )
                    return (
                      <tr key={result.driver_number}>
                        <td>{result.position}</td>
                        <td>{result.driver_number}</td>
                        <td>{driver ? driver.full_name : 'Unknown'}</td>
                        <td className="d-flex align-items-center gap-2">
                          {driver?.headshot_url && (
                            <Image
                              src={driver.headshot_url}
                              alt={`Headshot of ${driver.full_name}`}
                              width={48}
                              height={48}
                              roundedCircle
                            />
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>    
  )
}

export default App
