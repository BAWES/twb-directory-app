
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
            descriptionEn: "Coffee",
            descriptionAr: "Coffee",
            locationEn: "Kuwait",
            locationAr: "Kuwait",
            workingHours: "12pm to 1 am",
            website: "https://dwadwa.com",
            instagram: "@dwadaw",
            contactEmail: "dwadaw@dwadad.com",
            contactNumbers: {
                $num: "2539232223"
            }
        }
    },

    // When editing a vendor, admin should be able to select which categories/subcategories this vendor falls in.
    // Vendor can be in multiple categories and subcategories.
}


```