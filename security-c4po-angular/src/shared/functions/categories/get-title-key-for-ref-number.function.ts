export function getTitleKeyForRefNumber(refNumber: string): string {
  let translationKey = 'pentest.';
  let subRefNumberKey;
  const refNumberKey = refNumber.slice(refNumber.length - 3);

  switch (true) {
    case refNumber.includes('INFO'): {
      translationKey += 'info.' + refNumberKey;
      break;
    }
    case refNumber.includes('CONFIG'): {
      translationKey += 'config.' + refNumberKey;
      break;
    }
    case refNumber.includes('IDENT'): {
      translationKey += 'ident.' + refNumberKey;
      break;
    }
    case refNumber.includes('AUTHN'): {
      translationKey += 'authn.' + refNumberKey;
      break;
    }
    case refNumber.includes('AUTHZ'): {
      translationKey += 'authz.' + refNumberKey;
      break;
    }
    case refNumber.includes('SESS'): {
      translationKey += 'sess.' + refNumberKey;
      break;
    }
    case refNumber.includes('INPVAL'): {
      if (refNumber.includes('_')) {
        subRefNumberKey = refNumber.slice(refNumber.length - 5);
        translationKey += 'inpval.' + subRefNumberKey;
      } else {
        translationKey += 'inpval.' + refNumberKey;
      }
      break;
    }
    case refNumber.includes('ERR'): {
      translationKey += 'err.' + refNumberKey;
      break;
    }
    case refNumber.includes('CRYPST'): {
      translationKey += 'crypst.' + refNumberKey;
      break;
    }
    case refNumber.includes('BUSLOGIC'): {
      translationKey += 'buslogic.' + refNumberKey;
      break;
    }
    case refNumber.includes('CLIENT'): {
      translationKey += 'client.' + refNumberKey;
      break;
    }
    case refNumber.includes('API'): {
      translationKey += 'api.' + refNumberKey;
      break;
    }
    default: {
      translationKey = 'pentest.categories.translation';
      console.error('Invalid category number: ', refNumber.slice(4 - refNumber.length));
      break;
    }
  }
  return translationKey;
}
