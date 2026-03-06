import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getSectionIconComponent } from '../constants/sectionIcons';
import styles from './SectionCard.module.css';

export default function SectionCard({ section }) {
  const Icon = getSectionIconComponent(section?.icon);
  return (
    <Link to={`/section/${section.id}`} className={styles.card}>
      <span className={styles.iconWrap}>
        <Icon className={styles.icon} size={22} strokeWidth={2} />
      </span>
      <span className={styles.name}>{section.name}</span>
      <ChevronRight className={styles.arrow} size={20} aria-hidden />
    </Link>
  );
}
