import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { rupeeIndian } from "../../functions/helpers";
import Compass from "../../components/molecules/Compass";
import {
  getAllFlatsInFloor,
  getFlatFromPropertyId,
} from "../../functions/inventory";
import { DetailsSectionStyle } from "./booking.style";
import Dialog from "./Dialog";

const ImageText = ({ src, text }) => (
  <div className="img-text">
    <img src={`${process.env.PUBLIC_URL}/icons/${src}.svg`} />
    <span>{text}</span>
  </div>
);

function DetailsSection({ propertyId = false }) {
  // const id_from_url = "PR" + useLocation().hash.replace("%20", " ");
  const id_from_url = useLocation().pathname.replace("/booking/", "");
  const property_id = propertyId || id_from_url;
  const flat = getFlatFromPropertyId(property_id);
  console.log(flat);
  const [showPaymentplan, setShowPaymentplan] = useState(false);
  const [showFloorplan, setShowFloorplan] = useState(false);
  const ten_percent = flat.TotalCost * (10 / 100);
  return (
    <>
      <Dialog
        showDialog={showPaymentplan}
        setShowDialog={setShowPaymentplan}
        header="Payment Plan"
        body={
          <Paymentplan
            blocking_amount={20000}
            on_booking_amount={ten_percent - 20000}
            on_ats_amount={ten_percent}
            on_completion_amount={ten_percent * 7}
            on_possession_amount={ten_percent}
          />
        }
      />
      <Dialog
        showDialog={showFloorplan}
        setShowDialog={setShowFloorplan}
        header="Floor Plan"
        body={
          <div className="floorplan-img-wrapper">
            <img
              src={`${process.env.PUBLIC_URL}/images/flats/${flat["Tower"]}/${
                getAllFlatsInFloor(flat["Tower"], flat["Floor"]).indexOf(flat) +
                1
              }.png`}
              className="floorplan-img"
            />
            <Compass bottom="3rem" right="1rem" />
          </div>
        }
      />
      <DetailsSectionStyle>
        <table className="ft-lt">
          <tr>
            <td>
              <ImageText text="Unit" src="floor" />
            </td>
            <td className="value">{flat.FlatNumber}</td>
          </tr>
          <tr>
            <td>
              <ImageText text="Type" src="floor" />
            </td>
            <td className="value">{flat.UnitType}</td>
          </tr>
          <tr>
            <td>
              <ImageText text="RERA Carpet Area" src="area" />
            </td>
            <td className="value">{parseInt(flat.RERACarpetArea)} Sq.ft</td>
          </tr>
          <tr>
            <td>
              <ImageText text="Total Carpet Area" src="area" />
            </td>
            <td className="value">{parseInt(flat.CarpetArea)} Sq.ft</td>
          </tr>
          <tr>
            <td>
              <ImageText text="SBU Area" src="area" />
            </td>
            <td className="value">{parseInt(flat.Area)} Sq.ft</td>
          </tr>

          <tr>
            <td>
              <ImageText text="Price" src="rupee" />
            </td>
            <td className="value">
              {` ₹ ` + rupeeIndian.format(parseInt(flat["TotalCost"]))}
            </td>
          </tr>
          <tr>
            <td>
              <ImageText text="Floor Plan" src="floor-plan" />
            </td>
            <td className="value link">
              <span onClick={() => setShowFloorplan(true)}>View</span>
            </td>
          </tr>
          <tr>
            <td>
              <ImageText text="Payment Plan" src="cashless-payment" />
            </td>
            <td className="value link">
              <span onClick={() => setShowPaymentplan(true)}>View</span>
            </td>
          </tr>
        </table>
      </DetailsSectionStyle>
    </>
  );
}

export default DetailsSection;

const Paymentplan = ({
  blocking_amount,
  on_booking_amount,
  on_ats_amount,
  on_completion_amount,
  on_possession_amount,
}) => (
  <>
    <table>
      <tbody>
        <tr className="header">
          <td>Milestones</td>
          <td>%</td>
          <td>Amount</td>
        </tr>
        <tr>
          <td>Blocking Amount</td>
          <td>-</td>
          <td>₹ {rupeeIndian.format(parseInt(blocking_amount))}</td>
        </tr>
        <tr className="border">
          <td>On Booking</td>
          <td>10</td>
          <td>₹ {rupeeIndian.format(parseInt(on_booking_amount))}</td>
        </tr>
        <tr className="border">
          <td>On ATS within 30 days</td>
          <td>10</td>
          <td>₹ {rupeeIndian.format(parseInt(on_ats_amount))}</td>
        </tr>
        <tr className="border">
          <td>On Completion of 15th Floor Slab</td>
          <td>70</td>
          <td>₹ {rupeeIndian.format(parseInt(on_completion_amount))}</td>
        </tr>
        <tr className="border">
          <td>On Possession (Receipt of OC)</td>
          <td>10</td>
          <td>₹ {rupeeIndian.format(parseInt(on_possession_amount))}</td>
        </tr>
        <tr className="border">
          <td>Total*</td>
          <td>100</td>
          <td>
            ₹{" "}
            {rupeeIndian.format(
              parseInt(
                on_booking_amount +
                  on_ats_amount +
                  on_completion_amount +
                  on_possession_amount
              )
            )}
          </td>
        </tr>
      </tbody>
    </table>
    <div
      className="tnc"
      style={{
        color: "#3b3a3a",
        backgroundColor: "#f8f9fb",
        fontSize: "0.8rem",
        padding: "0.5rem",
        fontWeight: "600",
      }}
    >
      *Total Cost does not include GST, Maintenance Charges, and Maintenance
      Deposit.
    </div>
  </>
);
