import React, { useState, useEffect, CSSProperties } from "react";
import "./App.css";
import ClipLoader from "react-spinners/ClipLoader";
import Icon from "@mdi/react";
import { mdiSwapVertical, mdiPlusThick, mdiAirplane } from "@mdi/js";

const TravelRequest = () => {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "blue",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://api.npoint.io/4829d4ab0e96bfab50e7"
        );
        const res = await response.json();
        setFlights(res.data.result);
        setFilteredFlights(res.data.result);
      } catch (error) {
        console.error("Error fetching flight data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const sortedFlights = [...filteredFlights].sort((a, b) => {
      if (sortBy === "fare") {
        return a[sortBy] - b[sortBy];
      } else if (sortBy === "airline") {
        const airlineA = a.displayData.airlines[0].airlineName;
        const airlineB = b.displayData.airlines[0].airlineName;
        return airlineA.localeCompare(airlineB);
      }
      return 0;
    });
    setFilteredFlights(sortedFlights);
  }, [sortBy]);

  useEffect(() => {
    if (searchTerm !== "") {
      const filteredFlights = flights.filter((flight) => {
        return flight.displayData.airlines[0].airlineName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
      setFilteredFlights(filteredFlights);
    } else {
      setFilteredFlights(flights);
    }
  }, [searchTerm]);

  const handleSort = (value) => {
    setSortBy(value);
  };

  const handleAddBooking = () => {};

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="main-cont">
      <div className="heading">
        <Icon path={mdiAirplane} size={1} />
        Travel Request
        <Icon path={mdiAirplane} size={1} />
      </div>
      <div className="flight-nav-bar">
        <input
          type="text"
          placeholder="Search Flights"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button type="button" className="" onClick={handleAddBooking}>
          <Icon path={mdiPlusThick} size={0.8} />
          Add Booking
        </button>
      </div>
      {filteredFlights.length > 0 ? (
        <div className="flight-table">
          <div className="header-row">
            <div className="header-cell">No.</div>
            <div
              className="header-cell"
              onClick={() => {
                handleSort("airline");
              }}
            >
              Airline
              <Icon path={mdiSwapVertical} size={1} />
            </div>
            <div className="header-cell">Flight Number</div>
            <div
              className="header-cell"
              onClick={() => {
                handleSort("fare");
              }}
            >
              Price
              <Icon path={mdiSwapVertical} size={1} />
            </div>
            <div className="header-cell">Departure Airport</div>
            <div className="header-cell">Arrival Airport</div>
            <div className="header-cell">Stop/Duration</div>
          </div>
          {filteredFlights.map((item, i) => (
            <div className="table-row" key={i} tabIndex={"-1"}>
              <div className="table-cell">{i + 1}</div>
              <div className="table-cell">
                {item?.displayData?.airlines[0]?.airlineName}
              </div>
              <div className="table-cell">
                {item?.displayData?.airlines[0]?.flightNumber}
              </div>
              <div className="table-cell">{item?.fare}</div>
              <div className="table-cell">
                {item?.displayData?.source?.airport?.airportCode}
              </div>
              <div className="table-cell">
                {item?.displayData?.destination?.airport?.airportCode}
              </div>
              <div className="table-cell">{`${item?.displayData?.stopInfo}/(${item?.displayData?.totalDuration})`}</div>
            </div>
          ))}
        </div>
      ) : !loading ? (
        <div className="no-flight-found">No Flight Found</div>
      ) : null}

      {loading && (
        <ClipLoader
          color={"#ccc"}
          loading={loading}
          size={30}
          cssOverride={override}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      )}
    </div>
  );
};

export default TravelRequest;
