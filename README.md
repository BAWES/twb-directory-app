
## The White Book Directory App

Built based on Firebase

### DB Structure
```
twb: {
    admins: {
        $admin: true,
    },

    categories: {
        $category: {
            categoryTitleEn: "Food and Bev",
            categoryTitleAr: "Food and Bev",
        },
    },

    subcategories: {
        $parentCategory: {
            $subcategory: {
                subcategoryTitleEn: "Cakes",
                subcategoryTitleAr: "Cakes",
            }
        }
    }

    vendors: {
        $vendor: {
            vendorNameEn: "AlNouby Group",
            vendorNameAr: "AlNouby Group",
        }
    },
}


```