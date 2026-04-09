use gtk::prelude::*;
use relm4::prelude::*;

pub struct LevelbarDiscreteInverted;

#[relm4::component(pub)]
impl SimpleComponent for LevelbarDiscreteInverted {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::LevelBar {
            set_value: 2.0,
            set_min_value: 0.0,
            set_max_value: 4.0,
            set_mode: gtk::LevelBarMode::Discrete,
            set_inverted: true,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
