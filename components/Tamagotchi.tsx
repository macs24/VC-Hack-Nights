
import React from 'react';
import { TamagotchiStage, ShopItem, ItemCategory } from '../types';
import { TAMAGOTCHI_STAGES } from '../constants';


interface TamagotchiProps {
 experience: number;
 purchasedItems: ShopItem[];
 health: number;
 message: string;
}


const getTamagotchiForExperience = (experience: number): TamagotchiStage => {
 // Iterate backwards to find the first stage that meets the experience requirement
 for (let i = TAMAGOTCHI_STAGES.length - 1; i >= 0; i--) {
   if (experience >= TAMAGOTCHI_STAGES[i].minExperience) {
     return TAMAGOTCHI_STAGES[i];
   }
 }
 return TAMAGOTCHI_STAGES[0];
};


const Tamagotchi: React.FC<TamagotchiProps> = ({ experience, purchasedItems, health, message }) => {
 const currentStage = getTamagotchiForExperience(experience);


 // Simple positioning for a few decorations
 const decorationPositions = [
     'top-2 left-2',
     'top-2 right-2',
     'bottom-2 left-2',
     'bottom-2 right-2',
     'bottom-10 left-0',
     'bottom-10 right-0'
 ];
 const decorations = purchasedItems.filter(i => i.category === ItemCategory.Decoration);
 const backgroundItem = decorations.find(i => i.id === 2);
 const vassarHat = decorations.find(i => i.id === 1);
 const otherDecorations = decorations.filter(i => i.id !== 1 && i.id !== 2);


 const healthColor = health > 60 ? 'bg-success' : health > 30 ? 'bg-warning' : 'bg-danger';


 const hatPositioning: { [key: string]: React.CSSProperties } = {
   'Egg':   { top: '-2rem',   left: '50%', transform: 'translateY(16%) translateX(-51%) rotate(-40deg) scale(0.8)' },
   'Child': { top: '-1.5rem', left: '50%', transform: 'translateY(24%) translateX(-50%) rotate(0deg) scale(0.9)' },
   'Teen':  { top: '-1.5rem', left: '50%', transform: 'translateY(24%) translateX(-50%) rotate(0deg) scale(0.9)' },
   'Adult': { top: '-1.5rem', left: '50%', transform: 'translateY(24%) translateX(-50%) rotate(0deg) scale(0.9)' }
 };
 const hatStyles = hatPositioning[currentStage.name] || hatPositioning['Child'];


 return (
   <div className="bg-surface/50 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-subtle flex flex-col items-center">
    
      <div className="w-48 h-48 md:w-64 md:h-64 mb-4 group cursor-pointer relative mt-12">
        {backgroundItem && (
            <div className="absolute inset-0 flex items-center justify-center -z-10">
                <img src={backgroundItem.asset} alt={backgroundItem.name} className="w-full h-full object-cover rounded-2xl transform scale-125" />
            </div>
        )}
       {/* Health Bar - Moved here and positioned absolutely */}
       <div className="absolute -top-12 w-full">
           <p className="text-sm font-semibold text-text-subtle mb-1 text-center font-heading">Health</p>
           <div className="w-full bg-subtle/50 rounded-full h-5 relative border border-subtle">
               <div
                   className={`${healthColor} h-full rounded-full transition-all duration-500 ease-out`}
                   style={{ width: `${health}%` }}
               />
               <div className="absolute inset-0 text-center flex items-center justify-center text-xs font-bold text-white drop-shadow-md">
                   {health} / 100
               </div>
           </div>
       </div>


       {/* Message Bubble - Moved higher */}
       {message && (
           <div key={message} className="absolute -top-24 right-0 w-40 bg-white p-3 rounded-xl shadow-lg animate-bounce-slow z-10 border border-subtle">
               <p className="text-sm text-text-main text-center leading-tight">{message}</p>
               <div className="absolute left-6 -bottom-2 w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-white border-r-[10px] border-r-transparent"></div>
           </div>
       )}


       <div className="w-full h-full">
           <img
             src={currentStage.image}
             alt={currentStage.name}
             className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
           />
       </div>
       {/* Render Vassar Hat with special styling if purchased */}
       {vassarHat && (
            <div
               key={vassarHat.id}
               className="absolute w-24 h-48 md:w-56 md:h-28 opacity-100 hover:opacity-100 transition-all duration-500 origin-bottom"
               style={hatStyles}
           >
               <img src={vassarHat.asset} alt={vassarHat.name} className="w-full h-full object-contain"/>
           </div>
       )}


       {/* Render other purchased decorations */}
       {otherDecorations.slice(0, decorationPositions.length).map((item, index) => (
           <div key={item.id} className={`absolute ${decorationPositions[index]} w-10 h-10 md:w-12 md:h-12 opacity-80 hover:opacity-100 transition-opacity`}>
               <img src={item.asset} alt={item.name} className="w-full h-full object-contain"/>
           </div>
       ))}
     </div>
     <div className="text-center">
       <p className="text-text-subtle text-base">Current Stage:</p>
       <h3 className="text-4xl font-bold text-primary font-heading">
         {currentStage.name}
       </h3>
     </div>
   </div>
 );
};


export default Tamagotchi;