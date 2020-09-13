import react, { useState, useEffect } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Grid, Row, Col } from 'react-styled-flexboxgrid';
import axios from 'axios';

const years = [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020];
const launchStatus = ["True", "False"];
const landingStatus = ["True", "False"];


export default function Home({ launches }) {
  const [launchesArray, setLaunchesArray] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLaunchesArray(launches);
  }, [launches]);

  const getData = async (year, launchStatus, landingStatus) => {
    setLoading(true);
    // let url = `https://api.spacexdata.com/v3/launches?limit=100&launch_success=true&land_success=true&launch_year=2014`
    let url = `https://api.spacexdata.com/v3/launches?limit=100`;
    if (year) {
      url = url.concat(`&launch_year=${year}`);
    }
    if (launchStatus) {
      launchStatus == "True" ? url = url.concat(`&launch_success=${true}`) : url = url.concat(`&launch_success=${false}`);
    }
    if (landingStatus) {
      landingStatus == "True" ? url = url.concat(`&land_success=${true}`) : url = url.concat(`&land_success=${false}`);
    }
    try {
      const { data } = await axios.get(url);
      setLoading(false);
      return data;
    }
    catch (e) {
      setLoading(false);
      console.log("error getting data");
      console.log(e);
    }
  }

  const yearFilter = async (year) => {
    let launches = await getData(year);
    setLaunchesArray(launches);
  }

  const launchFilter = async (launch) => {
    let launches = await getData(null, launch);
    setLaunchesArray(launches);
  }

  const landingFilter = async (landing) => {
    let launches = await getData(null, null, landing);
    setLaunchesArray(launches);
  }

  return (
    <div>
      <Head>
        <title>SpacexX Launch Programs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Grid style={{ backgroundColor: "#dedede" }}>
        <Row>
          <h2 style={{ margin: 0 }}>SpaceX Launch Programs</h2>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={2} lg={2} style={{ backgroundColor: 'white', padding: 10, marginTop: 10 }}>
            <h3>
              <b>Filters</b>
            </h3>
            <h4 className={styles.subheading}>Launch Year</h4>
            <Row>
              {years.map((year, index) => {
                return (
                  <Col xs={6} sm={6} md={6} lg={6} key={index} style={{ padding: "5px 10px" }}>
                    <button className={styles.button} onClick={() => { yearFilter(year) }}>{year}</button>
                  </Col>
                )
              })}
            </Row>
            <h4 className={styles.subheading}>successful Launch</h4>
            <Row>
              {launchStatus.map((launch, index) => {
                return (
                  <Col xs={6} sm={6} md={6} lg={6} key={index} style={{ padding: "5px 10px" }}>
                    <button className={styles.button} onClick={() => { launchFilter(launch) }}>{launch}</button>
                  </Col>
                )
              })}
            </Row>
            <h4 className={styles.subheading}>Landing</h4>
            <Row>
              {landingStatus.map((landing, index) => {
                return (
                  <Col xs={6} sm={6} md={6} lg={6} key={index} style={{ padding: "5px 10px" }}>
                    <button className={styles.button} onClick={() => { landingFilter(landing) }}>{landing}</button>
                  </Col>
                )
              })}
            </Row>
          </Col>
          <Col xs={12} sm={12} md={10} lg={10}>
            {loading && <p>loading...</p>}
            {!loading && <Row>
              {launchesArray.map((item, index) => {
                return (
                  <Col key={index} xs={12} sm={6} md={4} lg={3} style={{ padding: 10 }}>
                    <div className="card" style={{ padding: 10, backgroundColor: 'white' }}>
                      <div className="imageContainer" style={{ width: '100%', backgroundColor: 'whitesmoke', padding: 5 }}>
                        <img style={{ width: '100%' }} src={item.links.mission_patch_small}></img>
                      </div>
                      <p className={styles.mission_name}>{item.mission_name}{' '}#{item.flight_number}</p>
                      <p><b>Mission Ids:</b></p>
                      <ul>
                        {item.mission_id.map((id, index) => {
                          return (
                            <li key={index}><span className={styles.blue}>{id}</span></li>
                          )
                        })}
                      </ul>
                      <p>
                        <b>Launch Year:</b>
                        <span className={styles.blue}>{item.launch_year}</span>
                      </p>
                      <p>
                        <b>Successful Launch:</b>
                        <span className={styles.blue}>{JSON.stringify(item.launch_success)}</span>
                      </p>
                      <p>
                        <b>Successful Landing:</b>
                        <span className={styles.blue}>{JSON.stringify(item.rocket.first_stage.cores[0].land_success)}</span>
                      </p>
                    </div>
                  </Col>
                )
              })}
            </Row>}
          </Col>
        </Row>
        <Row>
          <h2 style={{ marginTop: 20 }}>Developed by: Yashwant Dangi</h2>
        </Row>
      </Grid>
    </div>
  )
}

Home.getInitialProps = async (ctx) => {
  try {
    const { data } = await axios.get("https://api.spacexdata.com/v3/launches?limit=100");
    return {
      launches: data
    }
  }
  catch (e) {
    console.log("error getting data");
    console.log(e);
  }
}
