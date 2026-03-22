import { useMemo } from 'react';
import { useGetDistinctValuesQuery } from '../services/items';

export function buildDistinctParam(fieldKey) {
  if (!fieldKey) return '';
  if (fieldKey.startsWith('custom_')) {
    const key = fieldKey.replace(/^custom_/, '');
    return `customFields__${key}`;
  }
  return fieldKey;
}

export function useFieldSuggestions(fieldKey) {
  const distinctParam = useMemo(() => buildDistinctParam(fieldKey), [fieldKey]);
  const { data = [], ...rest } = useGetDistinctValuesQuery(distinctParam, {
    skip: !fieldKey || !distinctParam,
  });
  const options = useMemo(
    () => data.map((v) => ({ value: v, label: v })),
    [data]
  );
  return { options, optionsData: data, ...rest };
}
