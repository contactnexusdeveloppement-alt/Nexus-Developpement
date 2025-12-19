export interface CsvColumn {
  key: string;
  label: string;
}

export const exportToCSV = (
  data: Record<string, unknown>[],
  filename: string,
  columns: CsvColumn[]
) => {
  // BOM for Excel to recognize UTF-8
  const BOM = '\uFEFF';

  // Headers
  const headers = columns.map(c => `"${c.label}"`).join(';');

  // Rows
  const rows = data.map(item =>
    columns.map(c => {
      let value = item[c.key];

      // Handle arrays
      if (Array.isArray(value)) {
        value = value.join(', ');
      }

      // Handle null/undefined
      if (value === null || value === undefined) {
        value = '';
      }

      // Convert to string and escape quotes
      const strValue = String(value).replace(/"/g, '""');
      return `"${strValue}"`;
    }).join(';')
  );

  const csv = BOM + [headers, ...rows].join('\n');

  // Create and download file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
