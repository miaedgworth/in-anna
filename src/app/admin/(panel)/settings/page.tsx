import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSettingsFresh, settingDefinitions } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettingsFresh();

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold">Site settings</h2>
        <p className="mt-1 text-sm text-slate-600">
          The words on the site that are not part of a product, brand or photo. Leave a field empty
          to go back to the default wording.
        </p>
      </section>

      <SettingsForm
        fields={settingDefinitions.map((definition) => ({
          key: definition.key,
          label: definition.label,
          help: definition.help,
          type: definition.type,
          value: settings[definition.key],
        }))}
      />
    </div>
  );
}
