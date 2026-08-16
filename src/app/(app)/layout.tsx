import TabBar from "@/components/ui/TabBar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex flex-col md:flex-row">
      <TabBar />
      <main className="flex-1 pb-24 md:pb-0 md:ml-64">{children}</main>
    </div>
  );
}
