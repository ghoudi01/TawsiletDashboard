export const calculatePrice = async (ctx) => {
    let { distance, volume, accessDepart, accessArrivee, settings } = ctx;
  
    // Fetch pricing parameters from the settings API
    // const settingsResponse = await axios.get("${process.env.REACT_APP_BACKUP_URL}/api/settings");
    // const pricingParameters = settingsResponse.data;
    distance = distance / 1000;
    const {
      min_course,
      course_less_50,
      course_between_50_100,
      course_between_100_150,
      course_more_150,
      volume_50_moins,
      volume_50_plus,
      volume_50_100_moins,
      volume_50_100_plus,
      volume_100_150_moins,
      volume_100_150_plus,
      volume_150_moins,
      volume_150_plus,
      prix_rdc,
      etage_sans_ascen,
      etage_avec_ascen,
    } = settings;
  
    // Destructure pricing parameters
    // const {
    //   min_course,
    //   course_less_50,
    //   course_between_50_100,
    //   course_between_100_150,
    //   course_more_150,
    //   volume_50_moins,
    //   volume_50_plus,
    //   volume_50_100_moins,
    //   volume_50_100_plus,
    //   volume_100_150_moins,
    //   volume_100_150_plus,
    //   volume_150_moins,
    //   volume_150_plus,
    //   prix_rdc,
    //   etage_sans_ascen,
    //   etage_avec_ascen,
    // } = pricingParameters;
  
    // Apply the pricing formula based on the fetched parameters
  
    let price = 0;
  
    if (distance <= 50) {
      if (volume <= 3) {
        price =
          (course_less_50 * distance < min_course
            ? min_course
            : course_less_50 * distance) + volume_50_moins;
      } else {
        price =
          (course_less_50 * distance < min_course
            ? min_course
            : course_less_50 * distance) + volume_50_plus;
      }
    } else if (distance <= 100) {
      if (volume <= 3) {
        price = course_between_50_100 * distance + volume_50_100_moins;
      } else {
        price = course_between_50_100 * distance + volume_50_100_plus;
      }
    } else if (distance <= 150) {
      if (volume <= 3) {
        price = course_between_100_150 * distance + volume_100_150_moins;
      } else {
        price = course_between_100_150 * distance + volume_100_150_plus;
      }
    } else {
      if (volume <= 3) {
        price = course_more_150 * distance + volume_150_moins;
      } else {
        price = course_more_150 * distance + volume_150_plus;
      }
    }
    // ... Apply other conditions based on distance
  
    /*  if (volume < 50) {
        price += volume_50_moins;
      }
      // ... Apply other conditions based on volume
  */
    if (accessDepart && accessDepart?.options !== "Camion") {
      if (accessDepart.options === "Rez-de-chaussée") {
        price += prix_rdc;
      } else if (accessDepart.options === "Monter") {
        price += accessDepart.floor * etage_sans_ascen;
      } else {
        price += accessDepart.floor * etage_avec_ascen;
      }
    }
  
    if (accessArrivee && accessArrivee?.options !== "Camion") {
      if (accessArrivee.options === "Rez-de-chaussée") {
        price += prix_rdc;
      } else if (accessArrivee.options === "Monter") {
        price += accessArrivee.floor * etage_sans_ascen;
      } else {
        price += accessArrivee.floor * etage_avec_ascen;
      }
    }
  
    // ... Apply other conditions based on accessDepart
  
    // Return the calculated price
    return Math.floor(price * 100) / 100 < min_course
      ? min_course
      : Math.floor(price * 100) / 100;
  };