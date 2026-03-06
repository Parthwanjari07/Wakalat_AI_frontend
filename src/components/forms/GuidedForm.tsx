'use client';

import { useFormStore } from "../../store/formStore";
import { SelectField } from "./FormFields";
import MetadataForm from './MetadataForm';
import PartiesForm from './PartiesForm';
import CriminalCaseForm from './CriminalCaseForm';
import CivilCaseForm from './CivilCaseForm';
import CybercrimeCaseForm from './CybercrimeCaseForm';
import FamilyCaseForm from './FamilyCaseForm';

const GuidedForm = () => {
  const caseType = useFormStore(state => state.caseType);

  const caseTypeOptions = [
    { value: 'Criminal', label: 'Criminal Case' },
    { value: 'Civil', label: 'Civil Case' },
    { value: 'Cybercrime', label: 'Cybercrime Case' },
    { value: 'Family', label: 'Family Case' },
  ];

  const renderCaseSpecificForm = () => {
    switch (caseType) {
      case 'Criminal':
        return <CriminalCaseForm />;
      case 'Civil':
        return <CivilCaseForm />;
      case 'Cybercrime':
        return <CybercrimeCaseForm />;
      case 'Family':
        return <FamilyCaseForm />;
      default:
        return null;
    }
  };

  return (
    <div className="card-chamber p-6">
      <h2 className="font-serif text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
        Guided Case Details
      </h2>
      <p className="text-xs mb-5" style={{ color: 'var(--text-tertiary)' }}>Fill in the details below for a comprehensive legal analysis</p>

      <SelectField
        name="caseType"
        label="Select Case Type"
        options={caseTypeOptions}
        isRequired
      />

      {caseType && (
        <>
          <div className="brass-line my-6" />
          <MetadataForm />

          <div className="brass-line my-6" />
          <PartiesForm />

          <div className="brass-line my-6" />
          {renderCaseSpecificForm()}
        </>
      )}
    </div>
  );
};

export default GuidedForm;
