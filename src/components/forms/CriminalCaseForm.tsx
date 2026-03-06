'use client';

import { NestedInputField, NestedTextareaField } from './FormFields';

const CriminalCaseForm = () => {
  return (
    <section>
      <h3 className="font-serif text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
        C. Criminal Case Details
      </h3>
      <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>Offence details and applicable sections</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <NestedInputField parent="criminalDetails" name="natureOfOffence" label="Nature of Offence" placeholder="e.g., Theft / Assault / Cheating" isRequired />
        <NestedInputField parent="criminalDetails" name="sections" label="Sections Applicable" placeholder="e.g., Section 420, 302" />
      </div>
      <NestedTextareaField
        parent="criminalDetails"
        name="briefDescription"
        label="Brief Description & Other Details"
        placeholder="Provide all relevant details such as FIR/Complaint info, Accused & Victim details, any Weapons/Means used, Witnesses, and available Evidence."
        isRequired
      />
    </section>
  );
};

export default CriminalCaseForm;
