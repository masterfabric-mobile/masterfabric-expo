import { setValidatorHelperEmailValidator } from 'masterfabric-expo-core/src/helpers/validator_helper';
import { isValidEmail } from './utils/validator-helper-utils';

// Initialize validator helper's email validation
// Set custom email validator on module load to use validator helper's improved regex
setValidatorHelperEmailValidator(isValidEmail);

// Components
export { ValidatorAuthForm } from './components/validator-auth-form';
export { ValidatorHelperScreen } from './components/validator-helper-screen';
export { ValidatorInputField } from './components/validator-input-field';
export { ValidatorTestCard } from './components/validator-test-card';

// Constants
export * from './constants/validator-helper-constants';

// Hooks
export { useValidatorAuthFormViewModel } from './hooks/use-validator-auth-form-view-model';
export { useValidatorHelperViewModel } from './hooks/use-validator-helper-view-model';

// Models
export * from './models/validator-helper-models';

// Store
export { useValidatorHelperStore } from './store/validator-helper-store';

// Utils
export * from './utils/validator-helper-utils';

