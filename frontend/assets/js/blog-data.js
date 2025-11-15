// Centralized blog posts data
const blogPosts = [
  {
    id: 'b1',
    title: 'Managing Hypertension: Daily Habits',
    excerpt: 'Simple lifestyle changes can help control blood pressure...',
    tag: 'Wellness',
    imageUrl: 'https://via.placeholder.com/800x400?text=Managing+Hypertension',
    fullContent: `
      <p>Hypertension, or high blood pressure, is a common condition that can lead to serious health problems if left unmanaged. The good news is that simple lifestyle changes can make a big difference in controlling your blood pressure.</p>
      <p>Regular physical activity is one of the most effective ways to lower your blood pressure. Aim for at least 150 minutes of moderate exercise per week, such as brisk walking, swimming, or cycling. Even small amounts of activity can help reduce your blood pressure.</p>
      <p>Eating a healthy diet rich in fruits, vegetables, whole grains, and low-fat dairy products can significantly lower blood pressure. The DASH (Dietary Approaches to Stop Hypertension) eating plan is specifically designed to help manage blood pressure.</p>
      <p>Reducing sodium intake, limiting alcohol, managing stress, and maintaining a healthy weight are other important factors in controlling hypertension. Remember to monitor your blood pressure regularly and follow your healthcare provider's recommendations.</p>
    `
  },
  {
    id: 'b2',
    title: 'Vitamin D: Are You Getting Enough?',
    excerpt: 'Sunlight, diet, and supplements explained...',
    tag: 'Nutrition',
    imageUrl: 'https://via.placeholder.com/800x400?text=Vitamin+D+Sources',
    fullContent: `
      <p>Vitamin D is essential for strong bones, immune function, and overall health. Despite its importance, many people don't get enough of this vital nutrient. Here's what you need to know about maintaining healthy vitamin D levels.</p>
      <p>Sunlight is the most natural source of vitamin D. When your skin is exposed to sunlight, it produces vitamin D. However, factors like geographic location, skin pigmentation, sunscreen use, and time of year can all affect vitamin D production.</p>
      <p>Dietary sources of vitamin D include fatty fish (like salmon and mackerel), egg yolks, and fortified foods such as milk, orange juice, and cereals. For many people, especially those with limited sun exposure, supplements may be necessary.</p>
      <p>Vitamin D deficiency can lead to bone pain, muscle weakness, and increased risk of fractures. In children, severe deficiency can cause rickets. Talk to your healthcare provider about whether you should have your vitamin D levels checked and if supplementation is right for you.</p>
    `
  },
  {
    id: 'b3',
    title: 'Safe Medicine Storage at Home',
    excerpt: 'Keep medicines safe and effective with these tips...',
    tag: 'Safety',
    imageUrl: 'https://via.placeholder.com/800x400?text=Medicine+Storage',
    fullContent: `
      <p>Proper medication storage is crucial for maintaining effectiveness and preventing accidental poisoning, especially in households with children. Follow these guidelines to ensure your medications are stored safely and effectively.</p>
      <p>Most medications should be stored in a cool, dry place away from direct sunlight and moisture. The bathroom medicine cabinet is often not the best place due to humidity from showers. Instead, consider a high shelf in a bedroom closet or a kitchen cabinet away from the stove and sink.</p>
      <p>Always keep medications in their original containers with child-resistant caps securely fastened. Never transfer medications to unlabeled containers, as this can lead to dangerous mix-ups. Be particularly careful with medications that look similar to candy, especially gummy vitamins and chewable tablets.</p>
      <p>Regularly check your medicine cabinet for expired medications and dispose of them properly. Many pharmacies offer take-back programs for safe disposal. Never flush medications down the toilet unless the label specifically instructs you to do so.</p>
    `
  },
  {
    id: 'b4',
    title: 'The Importance of Sleep for Overall Health',
    excerpt: 'How quality sleep affects your physical and mental well-being...',
    tag: 'Wellness',
    imageUrl: 'https://via.placeholder.com/800x400?text=Quality+Sleep',
    fullContent: `
      <p>Sleep is not just a period of rest, but a critical component of overall health and well-being. Adults typically need 7-9 hours of quality sleep each night, yet many people regularly get less than the recommended amount.</p>
      <p>During sleep, your body works to support healthy brain function and maintain physical health. In children and teens, sleep also supports growth and development. Chronic sleep deficiency can increase the risk of various health problems, including heart disease, kidney disease, high blood pressure, diabetes, and stroke.</p>
      <p>To improve sleep quality, establish a regular sleep schedule, create a restful environment, and develop a relaxing bedtime routine. Avoid caffeine, nicotine, and large meals before bedtime, and limit screen time in the evening as the blue light can interfere with your natural sleep-wake cycle.</p>
      <p>If you consistently have trouble sleeping or feel tired during the day despite getting enough sleep, consult with a healthcare professional. You may have a sleep disorder that requires treatment.</p>
    `
  },
  {
    id: 'b5',
    title: 'Understanding Food Allergies and Intolerances',
    excerpt: 'Learn the differences and how to manage them...',
    tag: 'Nutrition',
    imageUrl: 'https://via.placeholder.com/800x400?text=Food+Allergies',
    fullContent: `
      <p>Food allergies and intolerances are often confused, but they are different conditions that affect the body in distinct ways. Understanding these differences is crucial for proper management and treatment.</p>
      <p>A food allergy involves the immune system and can cause severe, potentially life-threatening reactions. Common food allergens include peanuts, tree nuts, milk, eggs, wheat, soy, fish, and shellfish. Even tiny amounts of the allergen can trigger symptoms like hives, swelling, difficulty breathing, and anaphylaxis.</p>
      <p>In contrast, food intolerances (like lactose intolerance) typically involve the digestive system and are generally less serious. Symptoms may include bloating, gas, diarrhea, or stomach pain. While uncomfortable, these reactions are not life-threatening.</p>
      <p>If you suspect you have a food allergy or intolerance, consult with a healthcare professional for proper testing and diagnosis. They can help you develop a management plan, which may include dietary changes, medications, or carrying emergency treatment like an epinephrine auto-injector for severe allergies.</p>
    `
  },
  {
    id: 'b6',
    title: 'First Aid Essentials for Every Home',
    excerpt: 'Be prepared for common household emergencies...',
    tag: 'Safety',
    imageUrl: 'https://via.placeholder.com/800x400?text=First+Aid+Kit',
    fullContent: `
      <p>Having a well-stocked first aid kit and knowing how to use it can make a significant difference in an emergency. Whether you're dealing with minor cuts and scrapes or more serious situations before professional help arrives, being prepared is key.</p>
      <p>Every home first aid kit should include: adhesive bandages in various sizes, sterile gauze pads and adhesive tape, antiseptic wipes and antibiotic ointment, tweezers and scissors, a digital thermometer, disposable gloves, pain relievers, antihistamines, and any personal medications. Also include emergency phone numbers and a first aid manual.</p>
      <p>Basic first aid skills everyone should know include how to clean and dress a wound, perform CPR, help someone who is choking, recognize the signs of a heart attack or stroke, and treat minor burns. Consider taking a certified first aid and CPR course to be fully prepared.</p>
      <p>Regularly check your first aid kit to replace used or expired items. Store it in a cool, dry place that's easily accessible to adults but out of reach of young children, and make sure all family members know where it's kept.</p>
    `
  }
];
