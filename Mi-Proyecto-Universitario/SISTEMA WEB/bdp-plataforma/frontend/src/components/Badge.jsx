// frontend/src/components/Badge.jsx
export default function Badge({ type = 'blue', children }) {
  return <span className={`badge b-${type}`}>{children}</span>;
}
