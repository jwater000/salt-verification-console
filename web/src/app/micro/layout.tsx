import DomainSubnav from "@/components/domain-subnav";

export default function MicroLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <DomainSubnav domain="micro" />
      {children}
    </div>
  );
}
