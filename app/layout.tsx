import styles from './page.module.scss';
import { RootLayoutProps } from './lib/definitions';

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html>
      <body className={styles.mainBody}>
        <div className={styles.container}>
          <div className={styles.generalBlock}>
            {children}
            </div></div>
      </body>
    </html>
  );
}
