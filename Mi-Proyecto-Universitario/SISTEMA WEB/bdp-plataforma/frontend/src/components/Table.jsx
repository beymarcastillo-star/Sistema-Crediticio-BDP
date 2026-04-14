// frontend/src/components/Table.jsx
export default function Table({ headers, children }) {
  return (
    <div className="tbl-wrap">
      <table>
        <thead>
          <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
