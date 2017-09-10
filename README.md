
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
            subcategories: {
                $subcategory: {
                    subcategoryTitleEn: "Cakes",
                    subcategoryTitleAr: "Cakes",
                }
            },
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
                    },
                },
            },
        },
    },

    subcategories: {
        $subcategory: {
            subcategoryTitleEn: "Cakes",
            subcategoryTitleAr: "Cakes",
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
                    },
                },
            },
        },        
    },

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
            },
            categories: { 
                //lookup for which categories this vendor is listed in (for update and delete)
                $category: {
                    categoryTitleEn: "Food and Bev",
                    categoryTitleAr: "Food and Bev",
                }, 
            },
            subcategories: { 
                //lookup for which subcategories this vendor is listed in (for update and delete)
                $subcategory: {
                    subcategoryTitleEn: "Cakes",
                    subcategoryTitleAr: "Cakes",
                }, 
            }
        },
    },
}


```