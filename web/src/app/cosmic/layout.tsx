import DomainSubnav from "@/components/domain-subnav";

export default function CosmicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <DomainSubnav domain="cosmic" />
      {children}
    </div>
  );
}
