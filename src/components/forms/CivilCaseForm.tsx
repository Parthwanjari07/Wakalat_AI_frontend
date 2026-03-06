'use client';

import { NestedInputField, NestedTextareaField } from './FormFields';

const CivilCaseForm = () => {
  return (
    <section>
      <h3 className="font-serif text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
        C. Civil Case Details
      </h3>
      <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>Dispute type and relief sought</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <NestedInputField parent="civilDetails" name="typeOfDispute" label="Type of Civil Dispute" placeholder="e.g., Property / Contract / Tort" isRequired />
        <NestedInputField parent="civilDetails" name="reliefSought" label="Relief Sought" placeholder="e.g., Permanent Injunction" isRequired />
      </div>
      <NestedInputField parent="civilDetails" name="claimAmount" label="Claim Value (if monetary)" placeholder="e.g., ₹25,00,000" />
      <NestedTextareaField
        parent="civilDetails"
        name="groundsOfDispute"
        label="Grounds of Dispute"
        placeholder="Provide all relevant details such as Sub-Category, Ownership/Possession details, and the basis of the conflict."
        isRequired
      />
    </section>
  );
};

export default CivilCaseForm;
