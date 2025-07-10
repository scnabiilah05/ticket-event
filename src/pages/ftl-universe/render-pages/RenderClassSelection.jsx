import axios from "axios";
import React, { useEffect, useState } from "react";
import { formatPriceFromString } from "../../../utils/PriceUtils";

const VIP_PRICE = import.meta.env.VITE_VIP_CLASS_PRICE;

export const RenderClassSelection = ({
  selectedPackage,
  handleNextStep,
  handlePreviousStep,
  formDataArray,
  lengthClass,
}) => {
  // State untuk slot kelas dinamis
  const [selectedClasses, setSelectedClasses] = useState(
    Array.from({ length: lengthClass }, () => "")
  );
  const [vipUpgrades, setVipUpgrades] = useState(
    Array.from({ length: lengthClass }, () => false)
  );

  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState({ getClasses: false });

  // Handler pilih kelas
  const handleClassChange = (idx, value) => {
    setSelectedClasses((prev) => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
    // Reset VIP jika kelas dikosongkan
    if (!value) {
      setVipUpgrades((prev) => {
        const updated = [...prev];
        updated[idx] = false;
        return updated;
      });
    }
  };

  // Handler toggle VIP
  const handleVipToggle = (idx) => {
    setVipUpgrades((prev) => {
      const updated = [...prev];
      updated[idx] = !updated[idx];
      return updated;
    });
  };

  // Kelas yang sudah dipilih di slot lain
  const getAvailableOptions = (idx) => {
    let filtered = classes.filter(
      (cls) => !selectedClasses.some((sel, i) => sel === cls.id && i !== idx)
    );

    // Kondisi khusus untuk paket bundling
    if (selectedPackage?.uuid === import.meta.env.VITE_BUNDLING_CLASS_ID) {
      // Jika memilih kelas kedua (idx === 1)
      if (idx === 1 && selectedClasses[0]) {
        const kelasPertama = classes.find((c) => c.id == selectedClasses[0]);
        if (kelasPertama && kelasPertama.is_bundling === 0) {
          // Hanya tampilkan kelas dengan is_bundling = 1
          filtered = filtered.filter((cls) => cls.is_bundling === 1);
        }
        // Jika kelas pertama is_bundling=1, kelas kedua bebas
      }
      // Jika memilih kelas pertama, tidak ada filter khusus
    }
    return filtered;
  };

  const getClasses = async () => {
    setIsLoading({ ...isLoading, getClasses: true });

    try {
      const response = await axios.get(`/universe/class_event`);
      if (response.data.status == 'success') {
        const data = await response.data.data;
        console.log(data, 'data', selectedPackage)
        setClasses(data);
      }
    } catch (error) {
      console.error("Error fetching class:", error);
    } finally {
      setIsLoading({ ...isLoading, getClasses: false });
    }
  };


  

  useEffect(() => {
    getClasses();
  }, []);

  // Summary
  const chosenClasses = selectedClasses.filter(Boolean);
  const chosenPackage = `${chosenClasses.length} Classes`;
  const chosenPackagePrice = Number(selectedPackage?.price)
  const vipAddOns = vipUpgrades.filter(Boolean)
  const totalVip = vipAddOns?.length * VIP_PRICE;
  const totalPayment = chosenPackagePrice + totalVip;

  return (
    <div className="terms-bg">
      <div className="header-row">
        <div>
          <h2 className="title-header">Select the Classes You Want to Join</h2>
          <p className="desc-header">
            Browse the available sessions and choose the ones that best match
            your interest and availability
          </p>
        </div>
        <img
          src="/images/Universe Logo - Transparent.png"
          alt="FTL Universe Logo"
          className="logo-header"
        />
      </div>
      <div className="divider-header"></div>
      <div className="class-selection-grid">
        {/* Kiri: Form Pilih Kelas */}
        <div className="class-selection-left">
          <div className="vip-info-box">
            <div className="vip-info-title">
              <span className="vip-badge">VIP Upgrade</span>
              <span className="vip-info-price">(Rp100.000 /Class)</span>
            </div>
            <ul className="vip-info-list">
              <li>Fast-track check-in</li>
              <li>Smoother class access</li>
              <li>Exclusive VIP badge</li>
            </ul>
          </div>
          <div className="class-selection-note">
            <span className="class-selection-note-icon">&#9432;</span>
            You can't select the same class more than once. Please choose a
            different class for each slot.
          </div>
          {/* Slot Kelas Dinamis */}
          {Array.from({ length: lengthClass }).map((_, idx) => (
            <div className="class-slot-row" key={idx}>
              <div className="class-slot-label-row">
                <label>{`Class Name ${idx + 1}`}</label>
                <div className="vip-toggle-row">
                  <span>VIP Upgrade</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={vipUpgrades[idx]}
                      onChange={() => handleVipToggle(idx)}
                      disabled={!selectedClasses[idx]}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
              <select
                className="class-slot-select"
                value={selectedClasses[idx]}
                onChange={(e) => handleClassChange(idx, e.target.value)}
                onFocus={getClasses} // fetch ulang saat select dibuka
              >
                <option value="">
                  {idx === lengthClass - 1
                    ? "Choose your class"
                    : classes[idx]?.classname || "Choose your class"}
                </option>
                {getAvailableOptions(idx).map((cls) => {
                  const slotTersisa = cls.max_students - cls.terdaftar;
                  return (
                    <option key={cls.id} value={cls.id} disabled={slotTersisa <= 0}>
                      {cls.classname} {slotTersisa <= 0 ? "(Full)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>
          ))}
        </div>
        {/* Kanan: Summary */}
        <div className="class-selection-right">
          <div className="summary-box">
            <div className="summary-title">Summary</div>
            <div className="summary-desc">
              Make sure your chosen classes and package are correct before
              proceeding.
            </div>
            <div className="summary-section">
              <div className="summary-section-title">Chosen Class</div>
              <div className="summary-chosen-class-list">
                {selectedClasses.map((clsId, idx) => {
                  const found = classes.find((c) => c.id == clsId);
                  return found ? (
                    <div className="summary-chosen-class-item" key={idx}>
                      {found.classname}
                      {vipUpgrades[idx] && (
                        <span className="vip-badge small">VIP</span>
                      )}
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            <div className="summary-section">
              <div className="summary-section-title">Chosen Package</div>
              <div className="summary-chosen-package-row">
                <span>{chosenPackage}</span>
                <span className="summary-chosen-package-price">
                  Rp{chosenPackagePrice.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="summary-section">
              <div className="summary-section-title">Detail Add Ons</div>
              <div className="summary-addons-list">
                {vipAddOns?.length === 0 && (
                  <div className="summary-addons-empty">-</div>
                )}
                {vipAddOns?.map((clsId, idx) => {
                  const found = classes.find((c) => c.id == clsId);
                  return found ? (
                    <div className="summary-addons-item" key={clsId}>
                      <span>
                        {found.classname} <span className="vip-badge small">VIP</span>
                      </span>
                      <span>Rp{VIP_PRICE.toLocaleString()}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            <div className="summary-total-row">
              <span>Total Payment</span>
              <span className="summary-total-amount">
                Rp{totalPayment.toLocaleString()}
              </span>
            </div>
            <div className="summary-btn-row">
              <button className="summary-prev-btn" onClick={handlePreviousStep}>
                Previous
              </button>
              <button className="summary-next-btn" onClick={handleNextStep}>
                Next
              </button>
            </div>
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
      </div>
    </div>
  );
};
