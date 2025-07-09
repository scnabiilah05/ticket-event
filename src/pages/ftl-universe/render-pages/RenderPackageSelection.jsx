import React, { useEffect, useState } from "react";
import "../pages/RegistrationPages.css";
import { packages } from "../../../datas/ftl-universe/packages";
import { formatPrice, formatPriceFromString } from "../../../utils/PriceUtils";
import axios from "axios";

export const RenderPackageSelection = ({
  selectedTab,
  selectedTicket,
  selectedPackage,
  setSelectedTab,
  setSelectedPackage,
  handlePreviousStep,
  handleNextStep,
}) => {
  const [isGroup, setIsGroup] = useState(null);
  const [packages, setPackages] = useState([]);

  const getPackage = async () => {
    let params = { type_ticket_uuid: selectedTicket?.uuid };

    if (isGroup == null) {
      params;
    } else {
      params.is_group = isGroup;
    }

    console.log('params', params)

    try {
      const response = await axios.get(`/universe/get_package`, {
        params: params,
      });
      console.log(response.data, '911')
      if (response.data.status == 'success') {
        const data = await response.data.data;
        setPackages(data);
      }
    } catch (error) {
      console.error("Error fetching package:", error);
    }
  };
  const selected = selectedPackage || packages[0];

  useEffect(() => {
    if (selectedTicket?.uuid) {
      setPackages([])
      getPackage();
      setSelectedPackage({})
    } 
  }, [selectedTab]);

  // Default select first package if none selected
  console.log('selected', selected)
  return (
    <div className="terms-bg">
      <div className="header-row">
        <div>
          <h2 className="title-header">
            Plot your trajectory into the FTL Universe
          </h2>
          <p className="desc-header">
            Begin your journey by choosing your travel mode — go solo or launch
            with a crew,
            <br />
            then select the class package that suits your mission.
          </p>
        </div>
        <img
          src="/images/Universe Logo - Transparent.png"
          alt="FTL Universe Logo"
          className="logo-header"
        />
      </div>
      <div className="divider-header"></div>

      {/* PACKAGE SELECTION SECTION */}
      <div className="package-selection-section">
        <div className="package-tabs-row">
          <button
            className={`package-tab${
              selectedTab === "single" ? " active" : ""
            }`}
            onClick={() => {
              setSelectedTab("single");
              setIsGroup(0);
              setSelectedPackage({});
            }}
          >
            Single Access
          </button>
          <button
            className={`package-tab${selectedTab === "group" ? " active" : ""}`}
            onClick={() => {
              setSelectedTab("group");
              setIsGroup(1);
              setSelectedPackage({});
            }}
          >
            Group Pass
          </button>
        </div>
        <div className="package-tabs-desc">
          {selectedTab === "single"
            ? "Single ticket purchase, valid for individual use only"
            : "Group ticket purchase, valid for group use"}
        </div>
        <div className="package-divider-header"></div>

        <div className="package-main-row">
          <div className="package-list-col">
            {packages?.map((pkg) => (
              <div
                key={pkg?.uuid}
                className={`package-list-item${
                  selected?.uuid === pkg?.uuid ? " selected" : ""
                }`}
                onClick={() => {console.log('pkg', pkg);setSelectedPackage(pkg)}}
              >
                <div className="package-list-title">{pkg?.title}</div>
                <div className="package-list-price">
                  Rp{" "}
                  {formatPriceFromString(pkg?.price)}
                </div>
              </div>
            ))}
          </div>
          <div className="package-detail-col">
            <div className="package-detail-header-row">
              <div className="package-detail-title">
                {selected?.title}
              </div>
              <div className="package-detail-price">
                Rp{" "}
                {formatPriceFromString(selected?.price)}
              </div>
            </div>
            <div className="package-divider-header"></div>

            <div className="package-detail-desc-label">Detail Package</div>
            <div className="package-detail-desc">
              {selected?.description}
            </div>
            <button className="package-buy-btn" onClick={handleNextStep}>Buy Package</button>
          </div>
        </div>
      </div>
      {/* Bottom right button row */}
      <div className="terms-btn-row">
        <button
          className="terms-btn terms-btn-prev"
          onClick={handlePreviousStep}
        >
          Back
        </button>
        {/* <button className="terms-btn terms-btn-next" onClick={handleNextStep}>
          Next
        </button> */}
      </div>
    </div>
  );
};
