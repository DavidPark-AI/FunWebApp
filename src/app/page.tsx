import { redirect } from 'next/navigation';
import { i18nConfig } from '@/i18n/config';

export default function Home() {
  // Redirect to default locale on the server side
  redirect(`/${i18nConfig.defaultLocale}`);
}
