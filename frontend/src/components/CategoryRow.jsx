import React from 'react'

const CategoryRow = ({ categories }) => {
  const defaultCategories = [
    {
      id: 1,
      name: 'Áo Thun Nam',
      image: 'https://2885371169.e.cdneverest.net//catalog/category/men-4_3_Ao-phong_Ao-phong-basic.webp',
      cta: '/ao-thun-nam'
    },
    {
      id: 2,
      name: 'Áo Sơ Mi Nam',
      image: 'https://2885371169.e.cdneverest.net//catalog/category/men-6_1_Ao-so-mi_Tat-ca.webp',
      cta: '/ao-so-mi-nam'
    },
    {
      id: 3,
      name: 'Quần Jeans Nam',
      image: 'https://2885371169.e.cdneverest.net//catalog/category/men-7_2_Quan_Quan-jeans.webp',
      cta: '/quan-jeans-nam'
    },
    {
      id: 4,
      name: 'Áo Blouse Nữ',
      image: 'https://cdn.hstatic.net/products/1000402464/fwbl25fh07c__2__9894f50b0d6f419d849330beb60c5fe6_master.jpg',
      cta: '/ao-blouse-nu'
    }
  ]

  const displayCategories = categories?.length > 0 ? categories : defaultCategories

  return (
    <section className="py-8 lg:py-12 bg-white">
      <div className="container px-4 lg:px-0">
        <h2 className="text-xl lg:text-3xl font-black text-[#333F48] mb-6">DÒNG HÀNG NỔI BẬT</h2>
        <div className="flex gap-2 lg:gap-4">
          {displayCategories.map(category => (
            <a
              key={category.id}
              href={category.cta || `/${category.slug}`}
              className="relative overflow-hidden rounded cursor-pointer group flex-1"
              style={{ aspectRatio: '4/5' }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
              <span className="absolute bottom-4 left-4 right-4 text-sm lg:text-lg font-black text-white text-center">
                {category.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryRow
