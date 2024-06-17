import { Banner } from "./Banner/Banner";
import RoomFilter from "./RoomFilter/RoomFilter";
import { RoomResultPanel } from "./RoomResultPanel/RoomResultPanel";
import "./RoomResults.scss";
import { SearchForm } from "./SearchForm/SearchForm";
import StepperComponent from "./Stepper/StepperComponent";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSearchParams } from "../redux/slice/searchSlice";

export function RoomResults() {
  const searchParams = new URLSearchParams(window.location.search);
  const dispatch = useDispatch();

  const startDate = new Date(searchParams.get("startDate") || "");
  const endDate = new Date(searchParams.get("endDate") || "");
  const selectedProperties = (
    searchParams.get("selectedProperties") || ""
  ).split(",");
  const numberOfRooms = parseInt(searchParams.get("numberOfRooms") || "1");
  const wheelchairAccessible =
    searchParams.get("wheelchairAccessible") === "true";
  const adultsCount = parseInt(searchParams.get("adultsCount") || "0");
  const kidsCount = parseInt(searchParams.get("kidsCount") || "0");
  const teensCount = parseInt(searchParams.get("teensCount") || "0");

  useEffect(() => {
    dispatch(
      setSearchParams({
        startDate,
        endDate,
        selectedProperties,
        numberOfRooms,
        wheelchairAccessible,
        adultsCount,
        kidsCount,
        teensCount,
      })
    );
  }, [
    dispatch,
    startDate,
    endDate,
    selectedProperties,
    numberOfRooms,
    wheelchairAccessible,
    adultsCount,
    kidsCount,
    teensCount,
  ]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(window.location.search);
    const newStartDate = new Date(newSearchParams.get("startDate") || "");
    const newEndDate = new Date(newSearchParams.get("endDate") || "");

    if (!newStartDate || !newEndDate || newStartDate >= newEndDate) {
      window.location.href = "/";
    }

    const newNumberOfRooms = parseInt(
      newSearchParams.get("numberOfRooms") || "1"
    );
    if (newNumberOfRooms > adultsCount || newNumberOfRooms > 20) {
      window.location.href = "/";
    }

    const timeDifference = Math.abs(
      newEndDate.getTime() - newStartDate.getTime()
    );
    const differenceInDays = Math.floor(timeDifference / (1000 * 3600 * 24));
    if (differenceInDays > 14) {
      window.location.href = "/";
    }

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);

    const fourMonthsFromNow = new Date();
    fourMonthsFromNow.setMonth(currentDate.getMonth() + 4);
    if (newEndDate > fourMonthsFromNow || newStartDate <= currentDate) {
      window.location.href = "/";
    }
  }, [startDate, endDate, numberOfRooms, adultsCount]);

  return (
    <div className="room-result-page">
      <div className="banner">
        <Banner />
      </div>
      <div className="stepper">
        <StepperComponent />
      </div>
      <div className="room-result-main-container">
        <div className="search-form">
          <SearchForm
            startDate={startDate}
            endDate={endDate}
            selectedProperties={selectedProperties}
            numberOfRooms={numberOfRooms}
            wheelchairAccessible={wheelchairAccessible}
            adultsCount={adultsCount}
            kidsCount={kidsCount}
            teensCount={teensCount}
          />
        </div>
        <div className="room-result-panel">
          <div className="room-results-filter">
            <RoomFilter />
          </div>
          <div className="room-results-cards">
            <RoomResultPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
