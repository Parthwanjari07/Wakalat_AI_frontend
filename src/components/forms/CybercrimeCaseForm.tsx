'use client';

import { NestedInputField, NestedTextareaField } from './FormFields';

const CybercrimeCaseForm = () => {
  return (
    <section>
      <h3 className="font-serif text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
        C. Cybercrime Case Details
      </h3>
      <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>Digital offence details and evidence</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <NestedInputField parent="cybercrimeDetails" name="natureOfCyberOffence" label="Nature of Cyber Offence" placeholder="e.g., Phishing & Financial Fraud" isRequired />
        <NestedInputField parent="cybercrimeDetails" name="platformInvolved" label="Affected Platforms / Services" placeholder="e.g., Gmail, PhonePe, Axis Bank" />
        <NestedInputField parent="cybercrimeDetails" name="modeOfOperation" label="Mode of Operation" placeholder="e.g., Fake bank link sent via email" />
        <NestedInputField parent="cybercrimeDetails" name="lossDetails" label="Monetary or Data Loss" placeholder="e.g., ₹93,30,000 lost" />
      </div>
      <NestedTextareaField
        parent="cybercrimeDetails"
        name="technicalDetails"
        label="Additional Technical Information"
        placeholder="Provide other details like Date Range, Complainant's technical info (User ID, mobile, email), any known Accused Details, and available Digital Evidence."
      />
    </section>
  );
};

export default CybercrimeCaseForm;
