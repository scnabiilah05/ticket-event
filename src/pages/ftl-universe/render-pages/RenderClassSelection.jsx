import React, { useState } from 'react';

const CLASS_OPTIONS = [
  'Body Pump',
  'Zumba',
  'LM Pilates',
  'Body Combat Universe',
  'Body Combat',
];
const PACKAGE_PRICE = 900000;
const VIP_PRICE = 100000;

export const RenderClassSelection = ( { handleNextStep, handlePreviousStep, formDataArray, lengthClass = 3} ) => {
  // State untuk slot kelas dinamis
  const [selectedClasses, setSelectedClasses] = useState(Array.from({ length: lengthClass }, () => ""));
  const [vipUpgrades, setVipUpgrades] = useState(Array.from({ length: lengthClass }, () => false));

  // Handler pilih kelas
  const handleClassChange = (idx, value) => {
    setSelectedClasses(prev => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
    // Reset VIP jika kelas dikosongkan
    if (!value) {
      setVipUpgrades(prev => {
        const updated = [...prev];
        updated[idx] = false;
        return updated;
      });
    }
  };

  // Handler toggle VIP
  const handleVipToggle = (idx) => {
    setVipUpgrades(prev => {
      const updated = [...prev];
      updated[idx] = !updated[idx];
      return updated;
    });
  };

  // Kelas yang sudah dipilih di slot lain
  const getAvailableOptions = (idx) => {
    return CLASS_OPTIONS.filter(opt =>
      !selectedClasses.some((sel, i) => sel === opt && i !== idx)
    );
  };

  // Summary
  const chosenClasses = selectedClasses.filter(Boolean);
  const chosenPackage = `${chosenClasses.length} Classes`;
  const chosenPackagePrice = PACKAGE_PRICE;
  const vipAddOns = selectedClasses
    .map((cls, idx) => (cls && vipUpgrades[idx] ? cls : null))
    .filter(Boolean);
  const totalVip = vipAddOns.length * VIP_PRICE;
  const totalPayment = chosenPackagePrice + totalVip;

  return (
    <>
      <div className="class-selection-header">
        <div className="class-selection-header-row">
          <div>
            <h2 className="class-selection-title">Select the Classes You Want to Join</h2>
            <p className="class-selection-subtitle">
              Browse the available sessions and choose the ones that best match your interest and availability
            </p>
          </div>
          <img
            src="/images/Universe Logo - Transparent.png"
            alt="FTL Universe Logo"
            className="class-selection-logo"
          />
        </div>
      </div>
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
            You can't select the same class more than once. Please choose a different class for each slot.
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
                onChange={e => handleClassChange(idx, e.target.value)}
              >
                <option value="">{idx === lengthClass - 1 ? "Choose your class" : CLASS_OPTIONS[idx] || "Choose your class"}</option>
                {getAvailableOptions(idx).map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        {/* Kanan: Summary */}
        <div className="class-selection-right">
          <div className="summary-box">
            <div className="summary-title">Summary</div>
            <div className="summary-desc">Make sure your chosen classes and package are correct before proceeding.</div>
            <div className="summary-section">
              <div className="summary-section-title">Chosen Class</div>
              <div className="summary-chosen-class-list">
                {selectedClasses.map((cls, idx) =>
                  cls ? (
                    <div className="summary-chosen-class-item" key={idx}>
                      {cls}
                      {vipUpgrades[idx] && <span className="vip-badge small">VIP</span>}
                    </div>
                  ) : null
                )}
              </div>
            </div>
            <div className="summary-section">
              <div className="summary-section-title">Chosen Package</div>
              <div className="summary-chosen-package-row">
                <span>{chosenPackage}</span>
                <span className="summary-chosen-package-price">Rp{chosenPackagePrice.toLocaleString()}</span>
              </div>
            </div>
            <div className="summary-section">
              <div className="summary-section-title">Detail Add Ons</div>
              <div className="summary-addons-list">
                {vipAddOns.length === 0 && <div className="summary-addons-empty">-</div>}
                {vipAddOns.map((cls, idx) => (
                  <div className="summary-addons-item" key={cls}>
                    <span>{cls} <span className="vip-badge small">VIP</span></span>
                    <span>Rp{VIP_PRICE.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="summary-total-row">
              <span>Total Payment</span>
              <span className="summary-total-amount">Rp{totalPayment.toLocaleString()}</span>
            </div>
            <div className="summary-btn-row">
              <button className="summary-prev-btn" onClick={handlePreviousStep}>Previous</button>
              <button className="summary-next-btn" onClick={handleNextStep}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
