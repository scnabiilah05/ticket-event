import React from "react";
import "../pages/RegistrationPages.css";
import { packages } from "../../../datas/ftl-universe/packages";
import { formatPrice } from "../../../utils/PriceUtils";

export const RenderPackageSelection = ({
  selectedTab,
  selectedTicket,
  selectedPackage,
  setSelectedTab,
  setSelectedPackage,
  handlePreviousStep,
  handleNextStep,
}) => {
  const filteredPackages = packages.filter((pkg) =>
    selectedTab === "single" ? pkg.type_group === 0 : pkg.type_group === 1
  );
  // Default select first package if none selected
  const selected = selectedPackage || filteredPackages[0];
  return (
    <div className="package-bg">
      <div className="package-header-row">
        <div>
          <h2 className="package-title">
            Plot your trajectory into the FTL Universe
          </h2>
          <p className="package-desc">
            Begin your journey by choosing your travel mode — go solo or launch
            with a crew,
            <n />
            then select the class package that suits your mission.
          </p>
        </div>
        <img
          src="/images/Universe Logo - Transparent.png"
          alt="FTL Universe Logo"
          className="package-logo"
        />
      </div>
      <div className="package-tabs-row">
        <button
          className={`package-tab${selectedTab === "single" ? " active" : ""}`}
          onClick={() => {
            setSelectedTab("single");
            setSelectedPackage(null);
          }}
        >
          Single Access
        </button>
        <button
          className={`package-tab${selectedTab === "group" ? " active" : ""}`}
          onClick={() => {
            setSelectedTab("group");
            setSelectedPackage(null);
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
      <div className="package-main-row">
        <div className="package-list-col">
          {filteredPackages?.map((pkg) => (
            <div
              key={pkg?.id}
              className={`package-list-item${
                selected?.id === pkg?.id ? " selected" : ""
              }`}
              onClick={() => setSelectedPackage(pkg)}
            >
              <div className="package-list-title">{pkg?.package_name}</div>
              <div className="package-list-price">
                Rp{" "}
                {formatPrice(
                  selectedTicket?.package_price?.find(
                    (p) => p.package_id === pkg?.id
                  )?.price || 0
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="package-detail-col">
          <div className="package-detail-header-row">
            <div className="package-detail-title">{selected?.package_name}</div>
            <div className="package-detail-price">
              Rp{" "}
              {formatPrice(
                selectedTicket?.package_price?.find(
                  (p) => p.package_id === selected?.id
                )?.price || 0
              )}
            </div>
          </div>
          <div className="package-detail-desc-label">Detail Package</div>
          <div className="package-detail-desc">
            Lorem ipsum dolor sit amet, consectetur adipis elit, sed do eiusmod
            <br />
            tempor incididunt ut labore et dolore magna Ut enim ad minim veniam,
            <br />
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.
          </div>
          <button className="package-buy-btn">Buy Package</button>
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
        <button className="terms-btn terms-btn-next" onClick={handleNextStep}>
          Next
        </button>
      </div>
    </div>
  );
};
