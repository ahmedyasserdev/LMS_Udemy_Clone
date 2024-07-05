import { db } from "@/lib/db"
import Categories from "./_components/Categories"
import SearchInput from "@/components/shared/SearchInput"

const SearchPage = async({searchParams} : {searchParams : {title : string ; categoryId : string}}) => {
  const categories = await db.category.findMany({
    orderBy : {name : 'asc'}
  })

  return (
    <>
       <div className = 'md:hidden px-6 block pt-6 md:mb-0 '>
      <SearchInput />
    </div>

      <div className="p-6">
        <Categories  items = {categories} />
      </div>
    </>
  )
}

export default SearchPage