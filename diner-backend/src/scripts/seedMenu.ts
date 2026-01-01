import dotenv from "dotenv";
import connectDB from "../config/database";
import MenuItem from "../models/Menu";

dotenv.config();

const seedMenu = async () => {
  try {
    await connectDB();

    const menuItems = [
      // Breakfast
      {
        name: "Classic Pancakes",
        description: "Fluffy pancakes with maple syrup and whipped butter.",
        price: 9.5,
        category: "Breakfast",
      },
      {
        name: "Breakfast Burrito",
        description: "Eggs, chorizo, cheddar, salsa roja in a soft flour tortilla.",
        price: 11,
        category: "Breakfast",
      },
      {
        name: "Avocado Toast",
        description: "Toasted artisanal bread, smashed avocado, pico de gallo.",
        price: 10,
        category: "Breakfast",
        isVegetarian: true,
      },
      // Brunch
      {
        name: "Latin Eggs Benedict",
        description: "Poached eggs, arepa, slow-cooked pork, chipotle hollandaise.",
        price: 13.5,
        category: "Brunch",
      },
      {
        name: "Café Con Leche French Toast",
        description: "Thick brioche slices, espresso custard, warm berries.",
        price: 12,
        category: "Brunch",
      },
      // Lunch
      {
        name: "Chimi Burger",
        description: "Char-grilled patty, chimichurri aioli, lettuce, tomato, fries.",
        price: 14,
        category: "Lunch",
      },
      {
        name: "Chicken Milanesa Sandwich",
        description: "Crispy chicken, latin slaw, spicy mayo, soft roll.",
        price: 13,
        category: "Lunch",
      },
      // Dinner
      {
        name: "Vaca Frita Plate",
        description: "Crispy shredded beef, white rice, black beans, maduros.",
        price: 18,
        category: "Dinner",
        isGlutenFree: true,
      },
      {
        name: "Ropa Vieja Tacos",
        description: "Slow-braised beef, corn tortillas, avocado crema, pickled onions.",
        price: 16,
        category: "Dinner",
        isGlutenFree: true,
      },
      // Coffee & Drinks
      {
        name: "House Coffee",
        description: "Locally roasted, bottomless cup.",
        price: 3.5,
        category: "Coffee & Drinks",
      },
      {
        name: "Iced Horchata Latte",
        description: "Cold brew, horchata, cinnamon, ice.",
        price: 6,
        category: "Coffee & Drinks",
      },
      {
        name: "Fresh Squeezed OJ",
        description: "Florida oranges, squeezed to order.",
        price: 5,
        category: "Coffee & Drinks",
        isGlutenFree: true,
        isVegetarian: true,
      },
      // Cocktails
      {
        name: "Mimosa",
        description: "Sparkling wine, orange juice.",
        price: 9,
        category: "Cocktails, Beer, Wine",
      },
      {
        name: "Cuban Old Fashioned",
        description: "Rum, bitters, sugar, citrus twist.",
        price: 12,
        category: "Cocktails, Beer, Wine",
      },
      // Vegetarian
      {
        name: "Veggie Arepa Plate",
        description: "House arepas, black beans, avocado, salad.",
        price: 13,
        category: "Vegetarian & Healthy Options",
        isVegetarian: true,
        isGlutenFree: true,
      },
      {
        name: "Quinoa Bowl",
        description: "Tri-color quinoa, roasted veggies, cilantro-lime vinaigrette.",
        price: 13,
        category: "Vegetarian & Healthy Options",
        isVegetarian: true,
        isGlutenFree: true,
      },
      // Kids Menu
      {
        name: "Kid's Pancake Plate",
        description: "One pancake, scrambled egg, fruit.",
        price: 7,
        category: "Kids Menu",
        isKids: true,
      },
      {
        name: "Grilled Cheese & Fries",
        description: "Classic grilled cheese sandwich, fries.",
        price: 8,
        category: "Kids Menu",
        isVegetarian: true,
        isKids: true,
      },
    ];

    // Clear existing menu items (optional - comment out if you want to keep existing)
    // await MenuItem.deleteMany({});

    // Insert menu items
    const created = await MenuItem.insertMany(menuItems);

    console.log(`✅ Seeded ${created.length} menu items successfully!`);
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error seeding menu:", error.message);
    process.exit(1);
  }
};

seedMenu();

