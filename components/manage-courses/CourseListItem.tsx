'use client';
import { useTranslations } from 'next-intl';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { categoryLabel, type Category, type Course } from './types';

interface Props {
  course: Course;
  categories: Category[];
  onEdit: (c: Course) => void;
}

export default function CourseListItem({
  course: c,
  categories,
  onEdit,
}: Props) {
  const t = useTranslations('manageCourses');
  const thumbSize = { xs: 56, sm: 72 };

  return (
    <Card>
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: { xs: 1.25, sm: 2 },
          p: { xs: 1.5, sm: 2 },
          '&:last-child': { pb: { xs: 1.5, sm: 2 } },
        }}
      >
        {c.thumbnailUrl ? (
          <Box
            component="img"
            src={c.thumbnailUrl}
            alt=""
            sx={{
              width: thumbSize,
              height: thumbSize,
              borderRadius: 1.5,
              objectFit: 'cover',
              bgcolor: 'background.default',
              flexShrink: 0,
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
            }}
          />
        ) : (
          <Box
            sx={{
              width: thumbSize,
              height: thumbSize,
              borderRadius: 1.5,
              bgcolor: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              flexShrink: 0,
            }}
          >
            📚
          </Box>
        )}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              flexWrap: 'wrap',
              mb: 0.25,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '0.95rem', sm: '1rem' },
                lineHeight: 1.3,
                wordBreak: 'break-word',
              }}
            >
              {c.title}
            </Typography>
            {c.category && (
              <Chip
                label={categoryLabel(c.category, categories)}
                size="small"
                sx={{ height: 20, fontSize: '0.62rem', width: 'fit-content' }}
              />
            )}
            {c.price > 0 && (
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: 'secondary.main' }}
              >
                ${Number(c.price).toFixed(2)}
              </Typography>
            )}
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {c.description}
          </Typography>

          {c.tags && c.tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.75 }}>
              {c.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{ height: 18, fontSize: '0.6rem' }}
                />
              ))}
            </Box>
          )}

          <Typography
            variant="caption"
            sx={{ color: 'text.disabled', display: 'block', mt: 0.75 }}
          >
            {t('lessons', { count: c.lessonCount ?? 0 })}
            {c.totalDurationMinutes
              ? ` · ${t('duration', { minutes: c.totalDurationMinutes })}`
              : ''}
            {c.createdAt
              ? ` · ${t('createdAt', { date: new Date(c.createdAt).toLocaleDateString() })}`
              : ''}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.25, flexShrink: 0 }}>
          <IconButton
            onClick={() => onEdit(c)}
            size="small"
            aria-label={t('editCourse')}
            title={t('editCourse')}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}
