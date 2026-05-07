import Breadcrumb from "@/components/layout/breadcrumb";
import CalendarBox from "@/components/common/calendar-box";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calender Page",
  // other metadata
};

const CalendarPage = () => {
  return (
    <>
      <Breadcrumb pageName="Calendar" />

      <CalendarBox />
    </>
  );
};

export default CalendarPage;
