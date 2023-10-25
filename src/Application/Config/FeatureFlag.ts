export const ENABLE_CODE_EDITOR = isEnableCodeEditor();

function isEnableCodeEditor(): boolean {
  const queryInput = getBooleanQueryParam(
    "ENABLE_CODE_EDITOR",
    window.location.search
  );
  if (queryInput === undefined) {
    return false;
  }
  return queryInput;
}

function getBooleanQueryParam(paramName: string, queryString: string) {
  const urlParams = new URLSearchParams(queryString);
  const paramValue = urlParams.get(paramName);

  if (paramValue === null) {
    return undefined;
  }

  return paramValue === "true";
}
