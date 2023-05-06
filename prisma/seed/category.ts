import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createCategories() {
  const categories = await prisma.category.createMany(categoryDataList);
  console.log(`${categories.count} categories were created!`);
}

function generateCategoryDataFromSlug(slug: string): {
  name: string;
  coverImg: string;
  slug: string;
} {
  const name = `${slug[0].toUpperCase()}${slug.slice(1)} Food`;
  const slugCapitalized = `${slug[0].toUpperCase()}${slug.slice(1)}`;
  const coverImg = `https://tb-static.uber.com/prod/web-eats-v2/categories/icons/${slugCapitalized}_CuisineCarousel@2x.png`;
  return {
    name,
    coverImg,
    slug,
  };
}

const countryFoodArray = [
  'american',
  'mexican',
  'chinese',
  'japanese',
  'italian',
  'healthy',
  'asian',
  'indian',
  'thai',
  'taiwanese',
];

const countryFoodDataList = countryFoodArray.map((slug) => {
  return generateCategoryDataFromSlug(slug);
});

export const categoryDataList = {
  data: [
    {
      name: 'Fast Food',
      coverImg:
        'https://tb-static.uber.com/prod/web-eats-v2/categories/icons/FastFood_CuisineCarousel@2x.png',
      slug: 'fast-food',
    },
    {
      name: 'Breakfast And Brunch',
      coverImg:
        'https://tb-static.uber.com/prod/web-eats-v2/categories/icons/Breakfast_CuisineCarousel@2x.png',
      slug: 'breakfast-and-brunch',
    },
    ...countryFoodDataList,
  ],
};
