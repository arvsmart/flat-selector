import React, { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { Link, useParams } from "react-router-dom";
import tippy, { createSingleton } from "tippy.js";
import { string } from "yup";
import Carousel from "../components/molecules/Carousel";
import { Collapsible } from "../components/molecules/CustomCollapsible";
import Floor from "../components/molecules/Floor";
import HoverInfo from "../components/molecules/HoverInfo";
import Tower from "../components/molecules/Tower";
import CarouselPageDetails from "../components/molecules/CarouselPageDetails";
import { FLOORS } from "../data/paths";
import {
  getFormalNameFromNumber,
  getFormalUnitType,
  getFormatedMinMaxUnitSize,
} from "../functions/helpers";
import {
  getAllAvailableFlatsInFloor,
  getAllAvailableFlatsInTower,
  getAllDifferentUnitsSizesInBlock,
  getAllDifferentUnitsSizesInFloor,
  getAllFlatsInFloor,
  getAllFlatsInTower,
  getAllFloorsInTower,
  getAllUnitTypesInTower,
} from "../functions/inventory";
import { TowersPageStyle } from "./pages.style";

const HomeButton = () => (
  <Link to={"/"}>
    <div className="home-btn center">
      <img src={`${process.env.PUBLIC_URL}/icons/home.svg`} />
    </div>
  </Link>
);

const tippySetup = (towerId, floorNo) => {
  if (!towerId) return;
  const flats = getAllFlatsInFloor(towerId, floorNo);
  const flatFeatures = [];

  flats.forEach((flat) => {
    flatFeatures.push({
      title: `${flat["Flat Number"]}`,
      features: [
        // `${getAllFlatsInFloor(towerId, floor).length} Flats`,
        // `${[getAllUnitTypesInTower(towerId).join(" and ")]}`,
        // `${getFormatedMinMaxUnitSize(
        //   getAllDifferentUnitsSizesInFloor(towerId, floor)
        // )} Sq.fts`,
        // `${getAllAvailableFlatsInFloor(towerId, floor).length} Available`,
        // `${flat["Unit Status"]}`,
        `${flat["Unit Type"]} `,
        `${parseInt(flat["Total Carpet Area (sq.ft)"]).toFixed(0)} Sq.fts`,
        `${flat["Direction"]} `,
      ],
    });
  });

  setTimeout(() => {
    let tippyInstances = [];
    flatFeatures.forEach((flat, index) => {
      const tippyInstance = tippy(
        `#${towerId}-tower${floorNo}-floor-flat-path-${index}`,
        {
          content: ReactDOMServer.renderToStaticMarkup(
            <HoverInfo title={flat.title} features={flat.features} />
          ),
        }
      );
      tippyInstances.push(tippyInstance[0]);
    });

    createSingleton(tippyInstances, {
      delay: 0,
      arrow: false,
      moveTransition: "transform 0.1s ease-out",
      allowHTML: true,
      placement: "left-start",
      duration: [0, 1000],
      offset: [-40, 30],
    });
  }, 50);
};

function Floors() {
  const { floorId, towerId } = useParams();
  const [currentFloor, setCurrentFloor] = useState(floorId);
  useEffect(() => {
    FLOORS.forEach((floor) => tippySetup(towerId, floor.toString()));
  }, []);

  return (
    <TowersPageStyle>
      <HomeButton />
      <Collapsible>
        <CarouselPageDetails
          title={`${getFormalNameFromNumber(currentFloor)} Floor`}
          highlights={[
            <>
              {getAllFlatsInFloor(towerId, currentFloor).length} Units{" "}
              {
                <span className="separate">
                  {getAllAvailableFlatsInFloor(towerId, currentFloor).length}{" "}
                  Available
                </span>
              }
            </>,
            `${getFormatedMinMaxUnitSize(
              getAllDifferentUnitsSizesInFloor(towerId, currentFloor)
            )} Sq fts`,
          ]}
          features={[
            ...getAllUnitTypesInTower(towerId).map((type) => ({
              key: `${type} Apartments`,
              value: `${
                getAllFlatsInFloor(towerId, currentFloor).filter(
                  (flat) => getFormalUnitType(flat["Unit Type"]) === type
                ).length
              } units`,
            })),
          ]}
        />
      </Collapsible>
      <Carousel
        titleList={FLOORS}
        onChange={(changedItemIndex) =>
          setCurrentFloor(FLOORS.indexOf(changedItemIndex).toString())
        }
        currentItemIndex={FLOORS.indexOf(parseInt(currentFloor))}
      >
        {FLOORS.map((floor) => (
          <Floor towerId={towerId} key={floor} floorId={floor} />
        ))}
      </Carousel>
    </TowersPageStyle>
  );
}

export default Floors;