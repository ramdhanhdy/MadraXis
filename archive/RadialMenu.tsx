import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  Easing
} from 'react-native';
import { SvgXml } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
// Adjust menu size based on number of items and screen dimensions
const getMenuSize = (itemCount: number): number => {
  // For 4 or more items, use a smaller size to ensure everything fits
  if (itemCount >= 4) {
    return Math.min(width * 0.75, height * 0.45); // Smaller of width or height ratio
  }
  return width * 0.8; // Original size for 3 or fewer items
};

interface MenuItem {
  id: string;
  label: string;
  description: string;
  icon: string;
  onPress: () => void;
}

interface RadialMenuProps {
  items: MenuItem[];
}

const RadialMenu: React.FC<RadialMenuProps> = ({ items }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  // Calculate menu size based on number of items
  const MENU_SIZE = getMenuSize(items.length);
  // Adjust item size based on menu size and number of items
  const ITEM_SIZE = items.length >= 4 ? MENU_SIZE * 0.25 : MENU_SIZE * 0.28;
  // Center button size
  const CENTER_BUTTON_SIZE = MENU_SIZE * 0.25;
  
  // Create a ref for itemScaleAnims that updates when items change
  const itemScaleAnims = useRef<Animated.Value[]>([]);
  
  // Initialize or update the animation values when items change
  useEffect(() => {
    // Initialize animation values for each item
    itemScaleAnims.current = items.map((_, i) => 
      new Animated.Value(i === 0 ? 1.2 : 1)
    );
  }, [items]);
  
  // Calculate positions in a circle
  const getItemPosition = (index: number, totalItems: number) => {
    const angle = (index * 2 * Math.PI / totalItems);
    // Adjust radius to ensure items don't go outside the menu
    const radius = (MENU_SIZE / 2) - (ITEM_SIZE / 2) - 5; // 5px padding
    const x = radius * Math.cos(angle - Math.PI/2); // Start from top
    const y = radius * Math.sin(angle - Math.PI/2);
    return { x, y };
  };

  // Initial animation when component mounts
  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    }).start();
  }, []);

  // Handle item tap - simplified for better mobile experience
  const handleItemTap = (index: number) => {
    // Safety check
    if (index >= items.length || !itemScaleAnims.current || itemScaleAnims.current.length <= index) {
      return;
    }
    
    // Only proceed if selecting a different item
    if (index === selectedIndex) {
      // If tapping the already selected item, trigger its action
      items[index].onPress();
      return;
    }
    
    // Animate all items back to normal size
    itemScaleAnims.current.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
    
    // Animate the newly selected item to be larger
    if (itemScaleAnims.current[index]) {
      Animated.timing(itemScaleAnims.current[index], {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
    
    // Update the selected index
    setSelectedIndex(index);
  };

  // Handle center button press
  const handleCenterPress = () => {
    if (items && items.length > selectedIndex && items[selectedIndex]) {
      items[selectedIndex].onPress();
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.menuContainer,
          { 
            transform: [{ scale: scaleAnim }],
            width: MENU_SIZE,
            height: MENU_SIZE,
            borderRadius: MENU_SIZE / 2,
          }
        ]}
      >
        {/* Render menu items in a circle */}
        {items.map((item, index) => {
          // Calculate position based on the current selected index
          const { x, y } = getItemPosition(index, items.length);
          
          // Ensure we have a valid animation value for this item
          const scaleAnim = itemScaleAnims.current[index] || new Animated.Value(1);
          
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                selectedIndex === index && styles.selectedItem,
                {
                  position: 'absolute',
                  left: MENU_SIZE / 2 - ITEM_SIZE / 2 + x,
                  top: MENU_SIZE / 2 - ITEM_SIZE / 2 + y,
                  width: ITEM_SIZE,
                  height: ITEM_SIZE,
                  borderRadius: ITEM_SIZE / 2,
                  transform: [
                    { scale: scaleAnim }
                  ],
                }
              ]}
              onPress={() => handleItemTap(index)}
              activeOpacity={0.7} // Add visual feedback on touch
            >
              <SvgXml xml={item.icon} width={ITEM_SIZE * 0.5} height={ITEM_SIZE * 0.5} />
              <Text style={[styles.itemLabel, { fontSize: ITEM_SIZE * 0.15 }]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
        
        {/* Center button */}
        <TouchableOpacity 
          style={[
            styles.centerButton,
            {
              width: CENTER_BUTTON_SIZE,
              height: CENTER_BUTTON_SIZE,
              borderRadius: CENTER_BUTTON_SIZE / 2,
            }
          ]}
          onPress={handleCenterPress}
          activeOpacity={0.7} // Add visual feedback on touch
        >
          <Text style={styles.centerButtonText}>Pilih</Text>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Description of selected item */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          {items[selectedIndex]?.description || ''}
        </Text>
      </View>
      
      {/* Tap instruction */}
      <Text style={styles.instructionText}>
        Tekan tombol "Pilih" untuk melanjutkan
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  menuContainer: {
    backgroundColor: 'rgba(0, 94, 122, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  menuItem: {
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    padding: 5, // Add padding to increase touch area
  },
  selectedItem: {
    backgroundColor: '#f0c75e',
    borderWidth: 2,
    borderColor: '#005e7a',
  },
  itemLabel: {
    fontWeight: 'bold',
    color: '#005e7a',
    marginTop: 4,
    textAlign: 'center',
  },
  centerButton: {
    backgroundColor: '#005e7a',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 10,
  },
  centerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  descriptionContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  descriptionText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 24,
  },
  instructionText: {
    fontSize: 14,
    color: '#f0c75e',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default RadialMenu; 