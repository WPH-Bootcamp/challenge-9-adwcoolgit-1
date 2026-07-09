import { CategoryPageSkeleton } from '@/features/restaurants/components/category/category-page';

export default function CategoryLoading() {
  return (
    <main className='min-h-screen bg-(--color-neutral-50)'>
      <CategoryPageSkeleton />
    </main>
  );
}