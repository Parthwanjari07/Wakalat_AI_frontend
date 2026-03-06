import { InputField } from './FormFields';

const MetadataForm = () => {
  return (
    <section>
      <h3 className="font-serif text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
        A. Basic Case Metadata
      </h3>
      <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>Case identification and filing details</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <InputField name="firNo" label="Case / FIR / Petition No." placeholder="e.g., C.R. No. 45/2025" />
        <InputField name="jurisdiction" label="Jurisdiction / Police Station" placeholder="e.g., Cyber Police Station, Bandra" />
        <InputField name="dateOfIncident" label="Date of Filing / Incident" placeholder="Enter date" isRequired />
        <InputField name="location" label="Place of Incident" placeholder="Enter location" />
      </div>
    </section>
  );
};

export default MetadataForm;
